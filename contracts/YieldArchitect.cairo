```cairo
%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math import assert_not_zero

# ======================== Storage Variables ========================
@storage_var
func user_strategies(user: felt) -> (strategy: felt):
end

@storage_var
func encrypted_secrets(user: felt) -> (secrets_id: felt):
end

# ======================== External Functions ========================
@external
func store_strategy{
    syscall_ptr: felt*,
    pedersen_ptr: HashBuiltin*,
    range_check_ptr
}(user: felt, strategy: felt) {
    # Store the user's strategy
    user_strategies.write(user, strategy)
    return ()
}

@external
func retrieve_strategy{
    syscall_ptr: felt*,
    pedersen_ptr: HashBuiltin*,
    range_check_ptr
}(user: felt) -> (strategy: felt) {
    # Retrieve the user's strategy
    let (strategy) = user_strategies.read(user)
    return (strategy)
}

@external
func store_encrypted_secrets{
    syscall_ptr: felt*,
    pedersen_ptr: HashBuiltin*,
    range_check_ptr
}(user: felt, secrets_id: felt) {
    # Store the encrypted secrets ID
    encrypted_secrets.write(user, secrets_id)
    return ()
}

@external
func retrieve_encrypted_secrets{
    syscall_ptr: felt*,
    pedersen_ptr: HashBuiltin*,
    range_check_ptr
}(user: felt) -> (secrets_id: felt) {
    # Retrieve the encrypted secrets ID
    let (secrets_id) = encrypted_secrets.read(user)
    return (secrets_id)
}

# ======================== Views ========================
@view
func get_user_data{
    syscall_ptr: felt*,
    pedersen_ptr: HashBuiltin*,
    range_check_ptr
}(user: felt) -> (strategy: felt, secrets_id: felt) {
    # Retrieve both strategy and secrets ID for a user
    let (strategy) = user_strategies.read(user)
    let (secrets_id) = encrypted_secrets.read(user)
    return (strategy, secrets_id)
}

