#include <stdio.h>
#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <eosiolib/asset.hpp>
#include <eosiolib/crypto.h>
#include <eosiolib/types.hpp>
#include <eosio.token/eosio.token.hpp>
#include <eosio.system/eosio.system.hpp>

using namespace eosio;

template<typename CharT>

static std::string to_hex(const CharT* d, uint32_t s) {
  std::string r;
  const char* to_hex="0123456789abcdef";
  uint8_t* c = (uint8_t*)d;
  for( uint32_t i = 0; i < s; ++i ) {
    (r += to_hex[(c[i] >> 4)]) += to_hex[(c[i] & 0x0f)];
  }
  return r;
}

std::string hex_to_string(const std::string& input) {
  static const char* const lut = "0123456789abcdef";
  size_t len = input.length();
  if (len & 1) abort();
  std::string output;
  output.reserve(len / 2);
  for (size_t i = 0; i < len; i += 2) {
    char a = input[i];
    const char* p = std::lower_bound(lut, lut + 16, a);
    if (*p != a) abort();
    char b = input[i + 1];
    const char* q = std::lower_bound(lut, lut + 16, b);
    if (*q != b) abort();
    output.push_back(((p - lut) << 4) | (q - lut));
  }
  return output;
}

const char * const ALPHABET =
    "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const char ALPHABET_MAP[128] = {
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8, -1, -1, -1, -1, -1, -1,
    -1,  9, 10, 11, 12, 13, 14, 15, 16, -1, 17, 18, 19, 20, 21, -1,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, -1, -1, -1, -1, -1,
    -1, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, -1, 44, 45, 46,
    47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, -1, -1, -1, -1, -1
};

int base58encode(const std::string input, int len, unsigned char result[]) {
    unsigned char const* bytes = (unsigned const char*)(input.c_str());
    unsigned char digits[len * 137 / 100];
    int digitslen = 1;
    for (int i = 0; i < len; i++) {
        unsigned int carry = (unsigned int) bytes[i];
        for (int j = 0; j < digitslen; j++) {
            carry += (unsigned int) (digits[j]) << 8;
            digits[j] = (unsigned char) (carry % 58);
            carry /= 58;
        }
        while (carry > 0) {
            digits[digitslen++] = (unsigned char) (carry % 58);
            carry /= 58;
        }
    }
    int resultlen = 0;

    for (; resultlen < len && bytes[resultlen] == 0;)
        result[resultlen++] = '1';

    for (int i = 0; i < digitslen; i++)
        result[resultlen + i] = ALPHABET[digits[digitslen - 1 - i]];
    result[digitslen + resultlen] = 0;
    return digitslen + resultlen;
}

std::string getpubkey(std::string raw_type, signature &sig)
{
    std::string tmp;
    checksum256 digest;
    sha256(&raw_type[0], raw_type.size(), &digest);

    char pub[34]; // public key without checksum
    auto n = recover_key(&digest, (char *)&sig, sizeof(sig), pub, 34);
    assert(n == 34);

    std::string pubhex = to_hex(pub, sizeof(pub)).substr(2); // remove leading '00'
    tmp = hex_to_string(pubhex.c_str());
    strcpy(pub, tmp.c_str());

    checksum160 chksm;
    ripemd160(pub, 33, &chksm);

    tmp = hex_to_string(pubhex + to_hex(&chksm, 20).substr(0, 8)); // append checksum

    unsigned char encoded[37 * 137 / 100];
    base58encode(tmp, 37, encoded);
    tmp = "EOS" + std::string(reinterpret_cast<char *>(encoded));
    assert(tmp.length() == 53);
    print(tmp);

    return tmp;
}

class ec: public eosio::contract {
  private: 
    //@abi table question
    struct question
    {
        uint64_t question_key;
        std::string body;
        uint64_t user_key;
        std::string pub_key;
        uint64_t point = 0;
        uint64_t answer_count = 0;
        uint64_t allpoint = 0;
        eosio::time_point_sec time_stamp;

        uint64_t primary_key() const { return question_key; }
    };

    //@abi table answer
    struct answer
    {
        uint64_t answer_key;
        uint64_t question_key;
        std::string body;
        uint64_t user_key;
        std::string pub_key;
        uint64_t point = 0;
        eosio::time_point_sec time_stamp;

        uint64_t primary_key() const { return answer_key; }
    };

    //@abi table user
    struct user
    {
        uint64_t user_key;
        std::string pub_key;
        std::string meta;
        uint64_t point = 0;
        uint64_t count = 1;

        uint64_t primary_key() const { return user_key; }
    };

    //@abi table rate
    struct rate
    {
        account_name owner;
        double rate = 0.0001;
        eosio::time_point_sec time_stamp;

        uint64_t primary_key() const { return owner; }
    };

    typedef eosio::multi_index<N(question), question> question_table;
    question_table _question;

    typedef eosio::multi_index<N(answer), answer> answer_table;
    answer_table _answer;

    typedef eosio::multi_index<N(user), user> user_table;
    user_table _user;

    typedef eosio::multi_index<N(rate), rate> rate_table;
    rate_table _rate;

    int checkexist(std::string pub_key);

    std::vector<uint64_t> findkey(std::string rec_pub_key);

    std::vector<uint64_t> findquestion(std::string rec_pub_key, uint64_t question_key);

    std::vector<uint64_t> findanswer(std::string rec_pub_key, uint64_t answer_key);

  public:
    using contract::contract;
    ec(account_name self) : contract(self), _question(self, self), _answer(self, self), _user(self, self), _rate(self, self) {}

    void registeruser(std::string pub_key, account_name sender, std::string meta, signature &sig);

    void addquestion(std::string body, account_name sender, signature &sig, std::string rec_pub_key);

    void addanswer(uint64_t question_key, std::string body, account_name sender, signature &sig, std::string rec_pub_key);

    void tipquestion(uint64_t question_key, uint64_t point, account_name sender, signature &sig, std::string rec_pub_key);

    void tipanswer(uint64_t answer_key, uint64_t point, account_name sender, signature &sig, std::string rec_pub_key);

    void exchange(account_name username, uint64_t point, signature &sig, account_name sender, std::string rec_pub_key);

    void updaterate(double rate);
};