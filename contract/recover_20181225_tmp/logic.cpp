#include "recover.hpp"

int ec::checkexist(std::string pub_key)
{
    uint64_t check = 0;
    for (auto &item : _user)
    {
        if (item.pub_key == pub_key)
        {
            check++;
            break;
        }
    }
    eosio_assert(check == 0, "Already registered!");

    return check;
};

std::vector<uint64_t> ec::findkey(std::string rec_pub_key)
{
    std::vector<uint64_t> keysForDeletion;
    for (auto &item : _user)
    {
        if (item.pub_key == rec_pub_key)
        {
            keysForDeletion.push_back(item.count);
            keysForDeletion.push_back(item.user_key);
            break;
        }
    }
    eosio_assert(keysForDeletion[0] != NULL, "Not found your public key!");

    return keysForDeletion;
};