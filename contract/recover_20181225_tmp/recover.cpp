#include "logic.cpp"

void ec::registeruser(std::string rec_pub_key, account_name sender, std::string meta, signature &sig)
{
    require_auth(sender);
    uint64_t check = checkexist(rec_pub_key);

    auto supply = _supply.find(_self);
    auto pub_key = getpubkey(meta, sig);
    eosio_assert(pub_key == rec_pub_key, "Not found your public key!");

    _user.emplace(sender, [&](auto &u) {
        u.user_key = _user.available_primary_key();
        u.pub_key = pub_key;
        u.meta = meta;
    });

    _supply.modify(supply, sender, [&](auto &s) {
        s.total_supply = s.total_supply - USER_FUND;
    });
};

void ec::addquestion(std::string body, account_name sender, signature &sig, std::string rec_pub_key)
{
    require_auth(sender);

    std::vector<uint64_t> keysForDeletion = findkey(rec_pub_key);
    std::string con_question = body + std::to_string(keysForDeletion[0]);
    auto pub_key = getpubkey(con_question, sig);
    eosio_assert(pub_key == rec_pub_key, "Not found your public key!");

    auto user = _user.find(keysForDeletion[1]);
    auto supply = _supply.find(_self);

    _question.emplace(sender, [&](auto &q) {
        q.question_key = _question.available_primary_key();
        q.body = body;
        q.user_key = keysForDeletion[1];
        q.pub_key = pub_key;
        q.time_stamp = eosio::time_point_sec(now());
    });

    _user.modify(user, sender, [&](auto &u) {
        u.point = u.point + QUESTION_FUND;
        u.count++;
    });

    _supply.modify(supply, sender, [&](auto &s) {
        s.total_supply = s.total_supply - QUESTION_FUND;
    });
};

void ec::addanswer(uint64_t question_key, std::string body, account_name sender, signature &sig, std::string rec_pub_key)
{
    require_auth(sender);
    std::vector<uint64_t> keysForDeletion = findkey(rec_pub_key);
    std::string con_answer = body + std::to_string(keysForDeletion[0]);
    auto pub_key = getpubkey(con_answer, sig);
    eosio_assert(pub_key == rec_pub_key, "Not found your public key!");

    auto user = _user.find(keysForDeletion[1]);
    auto question_index = _question.find(question_key);
    auto owner = _user.find(question_index->user_key);
    auto supply = _supply.find(_self);

    _answer.emplace(sender, [&](auto &a) {
        a.answer_key = _answer.available_primary_key();
        a.question_key = question_key;
        a.body = body;
        a.user_key = keysForDeletion[1];
        a.pub_key = pub_key;
        a.time_stamp = eosio::time_point_sec(now());
    });

    _question.modify(question_index, sender, [&](auto &q) {
        q.answer_count++;
    });

    _user.modify(user, sender, [&](auto &u) {
        u.point = u.point + ANSWER_FUND;
        u.count++;
    });

    _user.modify(owner, sender, [&](auto &u) {
        u.point = u.point + ANSWER_FUND;
    });

    _supply.modify(supply, sender, [&](auto &s) {
        s.total_supply = s.total_supply - (ANSWER_FUND * PERSON_COUNT);
    });
};

void ec::tipquestion(uint64_t question_key, uint64_t point, account_name sender, signature &sig, std::string rec_pub_key)
{
    require_auth(sender);
    eosio_assert(point > 0, "point 0 is can not send!");

    std::vector<uint64_t> keysForDeletion = findkey(rec_pub_key);
    std::string con_tip = std::to_string(question_key) + std::to_string(point) + std::to_string(keysForDeletion[0]);
    auto pub_key = getpubkey(con_tip, sig);
    eosio_assert(pub_key == rec_pub_key, "Not found your public key!");

    auto question_index = _question.find(question_key);
    auto from = _user.find(keysForDeletion[1]);
    auto to = _user.find(question_index->user_key);

    eosio_assert(from != to, "Can not send point by myself!");
    eosio_assert(from->point >= point, "There is not enough money!");

    _user.modify(from, sender, [&](auto &u) {
        u.point = u.point - point;
        u.count++;
    });

    _user.modify(to, sender, [&](auto &u) {
        u.point = u.point + point;
    });

    _question.modify(question_index, sender, [&](auto &q) {
        q.point = q.point + point;
        q.allpoint = q.allpoint + point;
    });
};

void ec::tipanswer(uint64_t answer_key, uint64_t point, account_name sender, signature &sig, std::string rec_pub_key)
{
    require_auth(sender);
    eosio_assert(point > 0, "point 0 is can not send!");

    std::vector<uint64_t> keysForDeletion = findkey(rec_pub_key);
    std::string con_tip = std::to_string(answer_key) + std::to_string(point) + std::to_string(keysForDeletion[0]);
    auto pub_key = getpubkey(con_tip, sig);
    eosio_assert(pub_key == rec_pub_key, "Not found your public key!");

    auto answer_index = _answer.find(answer_key);
    auto question_index = _question.find(answer_index->question_key);
    auto from = _user.find(keysForDeletion[1]);
    auto to = _user.find(answer_index->user_key);

    eosio_assert(from != to, "Can not send point by myself!");
    eosio_assert(from->point >= point, "There is not enough money!");

    _user.modify(from, sender, [&](auto &u) {
        u.point = u.point - point;
        u.count++;
    });

    _user.modify(to, sender, [&](auto &u) {
        u.point = u.point + point;
    });

    _answer.modify(answer_index, sender, [&](auto &a) {
        a.point = a.point + point;
    });

    _question.modify(question_index, sender, [&](auto &q) {
        q.allpoint = q.allpoint + point;
    });
};

void ec::exchange(account_name username, uint64_t rec_point, signature &sig, account_name sender, std::string rec_pub_key)
{
    require_auth(_self);
    //require_auth(sender);
    //eosio_assert(rec_point >= 10000, "Can not exchange!");
    eosio_assert(rec_point >= EXCHANGE_LIMIT, "Can not exchange!");

    auto name = account_name{username};
    std::string name_str = std::to_string(name);

    std::vector<uint64_t> keysForDeletion = findkey(rec_pub_key);
    std::string con_exchange = name_str + std::to_string(rec_point) + std::to_string(keysForDeletion[0]);
    auto pub_key = getpubkey(con_exchange, sig);
    eosio_assert(pub_key == rec_pub_key, "Not found your public key!");

    auto from = _user.find(keysForDeletion[1]);
    uint64_t from_point = from->point;
    eosio_assert(from_point >= rec_point, "There is not enough money!");

    auto rate = _rate.find(_self);
    uint64_t pay_token = (rec_point * 0.01) * rate->rate * 10000;
    asset quantity = asset(pay_token, S(4, EOS));

    action(permission_level{get_self(), N(active)},
           N(eosio.token), N(transfer),
           std::make_tuple(get_self(), username, quantity, std::string("payment from buyer")))
        .send();

    _user.modify(from, sender, [&](auto &u) {
        u.point = u.point - rec_point;
        u.count++;
    });
};

void ec::updaterate(double rate)
{
    require_auth(_self);
    auto owner_index = _rate.find(_self);
    if (owner_index == _rate.end())
    {
        _rate.emplace(_self, [&](auto &r) {
            r.owner = _self;
            r.rate = rate;
            r.time_stamp = eosio::time_point_sec(now());
        });
    }
    else
    {
        _rate.modify(owner_index, _self, [&](auto &r) {
            r.rate = rate;
            r.time_stamp = eosio::time_point_sec(now());
        });
    }
};

void ec::createsupply(uint64_t supply)
{
    require_auth(_self);
    auto owner_index = _supply.find(_self);
    if (owner_index == _supply.end())
    {
        _supply.emplace(_self, [&](auto &s) {
            s.owner = _self;
            s.total_supply = supply;
            s.time_stamp = eosio::time_point_sec(now());
        });
    }
    else
    {
        _supply.modify(owner_index, _self, [&](auto &s) {
            s.total_supply = supply;
            s.time_stamp = eosio::time_point_sec(now());
        });
    }
};

EOSIO_ABI(ec, (registeruser)(addquestion)(addanswer)(tipquestion)(tipanswer)(exchange)(updaterate)(createsupply));