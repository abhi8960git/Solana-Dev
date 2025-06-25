use solana_program::{account_info::{next_account_info, AccountInfo}, entrypoint::{ProgramResult},entrypoint,pubkey::Pubkey};
use borsh::{BorshDeserialize, BorshSerialize};

entrypoint!(process_instruction);
#[derive(BorshDeserialize, BorshSerialize, Debug)]
struct OnChainCounter {
    count: u64,
}

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let mut iter = accounts.iter();
    let data_account = next_account_info(&mut iter)?;

    let mut counter = OnChainCounter::try_from_slice(&data_account.data.borrow())?;
    
    counter.count += 1;
    counter.serialize(&mut &mut data_account.data.borrow_mut()[..])?;

    Ok(())
}
