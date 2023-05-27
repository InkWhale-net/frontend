# Test Plan for InkWhale Frontend

- Table of Contents
  - [Introduction](#introduction)
  - [Test Cases](#test-cases)
    - [My Account](#My-Account)
    - [Acquire INW](#Acquire-INW)
      - [Acquire INW with vesting](#Acquire-INW-with-vesting)
      - [Acquire INW without vesting](#Acquire-INW-without-vesting)
    - [Create a token](#Create-a-token)
    - [Tokens](#Tokens)
      - [Check token](#Check-token)
      - [Transfer token](#Transfer-token)
      - [Burn token](#Burn-token)
    - [Create a token staking pool](#Create-a-token-staking-pool)
      - [Remove rewards after pool ends](#Remove-rewards-after-pool-ends)
    - [Create an NFT yield farm](#Create-an-NFT-yield-farm)
      - [Remove rewards after farm ends](#Remove-rewards-after-farm-ends)
    - [Stake a Token](#Stake-a-Token)
      - [Untake a Token](#Untake-a-Token)
    - [Stake an NFT](#Stake-an-NFT)
      - [Untake an NFT](#Untake-an-NFT)
    - [Admin](#Admin)

## Introduction
```
The purpose of this test plan is to outline the comprehensive testing approach for the InkWhale NFT Yield and Farming Platform. This platform aims to provide users with the ability to earn yield and farm non-fungible tokens (NFTs) through various mechanisms. By conducting thorough testing, we ensure that the platform functions as intended, meets quality standards, and provides a seamless user experience.

The scope of this test plan encompasses all frontend aspects of the NFT Yield and Farming Platform, including its core functionalities, user interfaces, backend processes, and integration with external systems. It involves testing the platform's features, performance, and compatibility across different devices, browsers, and operating systems.

The testing approach for the NFT Yield and Farming Platform will consist of a combination of manual testing techniques. It will involve the creation of test cases, test scenarios, and test data to cover different use cases, edge cases, and potential failure scenarios. Testing will be conducted in testnet environment to simulate real-world conditions and ensure a robust and reliable platform.

The deliverables will be produced as part of this test plan: Detailed test cases outlining the steps, inputs, and expected outcomes for each test scenario.

The key roles and responsibilities involved in the testing process include test analysts, developers, platform stakeholders, and quality assurance personnel. Test analysts will design and execute test cases, while developers will support bug fixes and enhancements based on the test results. Platform stakeholders will provide guidance and requirements, and quality assurance personnel will oversee the entire testing process.
By following this comprehensive test plan, we aim to ensure the NFT Yield and Farming Platform is stable, secure, and capable of delivering the intended functionalities and benefits to its users. The testing process will be iterative, with continuous feedback and improvements to provide a robust and reliable platform.

```

## Test Cases

### My Account
```
Test case ID: my_account_001
Test case Name: Verify My Account Display
Pre-requisite: User must have a valid wallet address
Expectations:
  -	The user's address should be displayed on the Account page.
  -	The Azero balance should be displayed on the Account page.
  -	The INW balance should be displayed on the Account page.
  - My Tokens, My pool, My farm buttons can be clicked and lead users to view information
  - The user can log in and log out of the account

Test Steps:
  1.	Log in to the Ink Whale platform.
  2.	Navigate to the Connect button. Choose the wallet and confirm with the wallet. 
  3.	Verify that the user's address is displayed on the page.
  4.	Verify that the Azero balance should be displayed correctly on the Account page.
  5.	Verify that the INW balance should be displayed correctly on the Account page.
  6.	Verify that My Tokens, My pool, My farm buttons can be clicked and lead users to view information
  7.  Click log out, the wallet is disconnected 

```

### Acquire INW

#### Acquire INW with vesting
```
Test Case ID: acquire_INW_with_vesting_001
Test Case Description: This test case verifies the successful acquisition of a token with vesting.

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet
2. Navigate to the Acquire INW tab in the toolbar.
3. Select the vesting option & Enter the desired amount of INW tokens and check the converted amount of Azero to be paid. The entered amount must be a positive number and cannot be higher than the total available INW.
4. Click Acquire INW button then Sign the transaction with your wallet.
5. Claim the INW generated vesting amount. Wait for the vesting duration to pass and claim all INW vesting amount

Expected Results:

- The tokens are successfully acquired with vesting and are visible in the user's wallet.
- INW balance is added with 5% of acquired INW
- Azero balance is deducted with the paid Azero and a little gas fee
- The INW vesting amount is added with 95% of acquired INW
- The unclaimed INW vesting amount is added correctly every block.
- The total acquired amount is fully vested after the vesting duration.
```

```
Test Case ID: acquire_INW_with_vesting_002
Test Case Description: This test case verifies the unsuccessful acquisition of a token with vesting due to invalid desired amoung of INW filled.

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet
2. Navigate to the Acquire INW tab in the toolbar.
3. Select the vesting option & Enter the desired amount of INW tokens that is either a negative number or higher than the total available INW.
4. Click Acquire INW button then Sign the transaction with your wallet.

Expected Results:

- Notice pop-up to figure out the wrong format of the desired amount of INW tokens, thus transaction cannot be made successful. 
```

#### Acquire INW without vesting](#Acquire-INW-without-vesting)
```
Test Case ID: acquire_INW_without_vesting_001
Test Case Description: This test case verifies the successful acquisition of a token without vesting.

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet
2. Navigate to the Acquire INW tab in the toolbar.
3. Select the without vesting option. Enter the desired amount of INW tokens that is either a negative number or higher than the total available INW and check the converted amount of Azero to be paid
4. Click Acquire INW button then Sign the transaction with your wallet.

Expected Results:

- The INW are successfully acquired without vesting (all acquired INW is added to balance)  and are visible in the user's wallet.
- INW balance is added with 100% of acquired INW
- Azero balance is deducted with the paid Azero and a little gas fee
```

```
Test Case ID: acquire_INW_without_vesting_002
Test Case Description: This test case verifies the unsuccessful acquisition of a token without vesting due to invalid desired amoung of INW filled.

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet.
2. Navigate to the Acquire INW tab in the toolbar.
3. Select the without vesting option. Enter the desired amount of INW tokens that is either a negative number or higher than the total available INW.
4. Click Acquire INW button then Sign the transaction with your wallet.

Expected Results:

- Notice pop-up to figure out the wrong format of the desired amount of INW tokens, thus transaction cannot be made successful.
```

### Create a token

```
Test Case ID: create_a_token_001
Test Case Description: This test case verifies the successful creation of a token

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. Make sure you have enough INW balance for transaction fee & a Azero for gas fee.
2. Navigate to the Create tab in the toolbar, then select Token
3. Fill in the required information as prompted including: 
- Token Name
- Token Symbol
- Total Supply: must be a positive integer
- Token icon: must be in a format of gif, jpeg, jpg, png
4. Click on the "CREATE TOKEN" button. Then, confirm this action with your wallet. 

Expected Results:

- The token is successfully created and displayed in Token tab.
- INW balance is deducted with transaction fee
```

```
Test Case ID: create_a_token_002
Test Case Description: This test case verifies the unsuccessful creation of a token due to invalid fillings

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. Make sure you have enough INW balance for transaction fee & a Azero for gas fee.
2. Navigate to the Create tab in the toolbar, then select Token
3. Fill in invalid information as prompted including one of the information below: 
- Total Supply: not a positive integer, or
- Token icon: not in a format of gif, jpeg, jpg, png
4. Click on the "CREATE TOKEN" button

Expected Results:

- Notice pop-up to figure out the wrong format of one of the information, thus transaction cannot be made successful.
```

```
Test Case ID: create_a_token_003
Test Case Description: This test case verifies the unsuccessful creation of a token due to low INW balance

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. Make sure you have less INW balance for transaction fee 
2. Navigate to the Create tab in the toolbar, then select Token
3. Fill in invalid information as prompted including one of the information below: 
- Total Supply: not a positive integer, or
- Token icon: not in a format of gif, jpeg, jpg, png
4. Click on the "CREATE TOKEN" button

Expected Results:

- Notice pop-up to figure out low INW , thus transaction cannot be made successful.
```

### Tokens
#### Check token

```
Test Case ID: check_balance_of_a_token_001
Test Case Description: This test case verifies the successful check of a wallet's balance of a token

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. Make sure you have the wallet address to check balance of a token.
2. Navigate to the Tokens tab in the toolbar, then select Check balance tab
3. Choose the token you want to check by one of the 3 ways below:
- Scroll down and choose the token, the contract address of the token will be loaded, or
- Search the token name and choose the token, the contract address of the token will be loaded, or
- Paste the contract address, the token will be loaded, or
4. Fill in the valid wallet address 
5. Click on the "CHECK" button. 

Expected Results:

- The amount of token is shown in the box to reveal the token balance of the wallet.
```

```
Test Case ID: check_balance_of_a_token_002
Test Case Description: This test case verifies the unsuccessful check of a wallet's balance of a token due to invalid contract address or invalid wallet address

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. Make sure you have the wallet address to check balance of a token.
2. Navigate to the Tokens tab in the toolbar, then select Check balance tab
3. Choose the token you want to check by one of the 2 ways below
- Search the token name but no token resulted for the search, or
- Paste the contract address, but no token resulted for the search
4. Fill in the wallet address which is not a valid Aleph Zero native wallet
5. Click on the "CHECK" button. 

Expected Results:

- Notice pop-up to figure out Invalid Contract address or Invalid address , thus  cannot be made successful.
```
#### Transfer token

```
Test Case ID: transfer_tokens_001
Test Case Description: This test case verifies the successful transfer tokens to a wallet

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. Make sure you have the wallet address to to transfer tokens.
2. Navigate to the Tokens tab in the toolbar, then select Transfer Tokens tab
3. Choose the token you want to check by one of the 3 ways below:
- Scroll down and choose the token, the contract address of the token will be loaded, or
- Search the token name and choose the token, the contract address of the token will be loaded, or
- Paste the contract address, the token will be loaded
4. Fill in the valid wallet address
5. Fill in the amount of tokens you want to transfer
6. Click on the "TRANSFER" button. Then, confirm this action with your wallet. 

Expected Results:

- The amount of token is successfully transferred from your wallet to the wallet you filled.
- Your balance is deducted with the transferred amount
- The receipt wallet is added with the transferred amount
```

```
Test Case ID: transfer_tokens_002
Test Case Description: This test case verifies the unsuccessful transfer tokens to a wallet due to invalid contract address or invalid wallet address

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. Make sure you have the wallet address to to transfer tokens.
2. Navigate to the Tokens tab in the toolbar, then select Transfer Tokens tab
3. Choose the token you want to check by one of the 3 ways below:
- Search the token name but no token resulted for the search, or
- Paste the contract address, but no token resulted for the search, or
4. Fill in the wallet address which is not a valid Aleph Zero native wallet
5. Fill in the amount of tokens you want to transfer
6. Click on the "TRANSFER" button. 

Expected Results:

- Notice pop-up to figure out Invalid Contract address or Invalid address , thus  cannot be made successful.
```

```
Test Case ID: transfer_tokens_003
Test Case Description: This test case verifies the unsuccessful transfer tokens to a wallet due to low balance or invalid amount

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. Make sure you have the wallet address to to transfer tokens.
2. Navigate to the Tokens tab in the toolbar, then select Transfer Tokens tab
3. Choose the token you want to check by one of the 3 ways below:
- Scroll down and choose the token, the contract address of the token will be loaded, or
- Search the token name and choose the token, the contract address of the token will be loaded, or
- Paste the contract address, the token will be loaded
4. Fill in the valid wallet address
5. Fill in the amount of tokens you want to transfer but the amount is either greater than your balance or the amount is not a positive number.
6. Click on the "TRANSFER" button. 

Expected Results:

- Notice pop-up to figure out Low balance or Invalid amount , thus  cannot be made successful.
```

#### Burn token
```
Test Case ID: burn_tokens_001
Test Case Description: This test case verifies the successful tokens burn 

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. 
2. Navigate to the "Tokens" tab in the toolbar, then select "Burn Token" tab
3. Choose the token you want to check by one of the 3 ways below:
- Scroll down and choose the token, the contract address of the token will be loaded, or
- Search the token name and choose the token, the contract address of the token will be loaded, or
- Paste the contract address, the token will be loaded
4. Fill in the amount of tokens you want to burn. Make sure the desired amount is not more than your balance.
6. Click on the "Burn" button. Then, confirm this action with your wallet. 

Expected Results:

- The amount of token is successfully burned from your wallet.
- The circulation amount of the token is deducted with the burned amount
```

```
Test Case ID: burn_tokens_002
Test Case Description: This test case verifies the successful tokens burn due to invalid contract address or invalid wallet address

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. 
2. Navigate to the "Tokens" tab in the toolbar, then select "Burn Token" tab
3. Choose the token you want to check by one of the 2 ways below:
- Search the token name but no token resulted for the search, or
- Paste the contract address, but no token resulted for the search, or
4. Fill in the amount of tokens you want to burn. Make sure the desired amount is not more than your balance.
5. Click on the "Burn" button. 

Expected Results:

- Notice pop-up to figure out Invalid Contract address or Invalid address, thus  cannot be made successful.
```

```
Test Case ID: burn_tokens_003
Test Case Description: This test case verifies the successful tokens burn due to low balance or invalid amount

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. 
2. Navigate to the "Tokens" tab in the toolbar, then select "Burn Token" tab
3. Choose the token you want to check by one of the 3 ways below:
- Scroll down and choose the token, the contract address of the token will be loaded, or
- Search the token name and choose the token, the contract address of the token will be loaded, or
- Paste the contract address, the token will be loaded
4. Fill in the amount of tokens you want to transfer but the amount is either greater than your balance or the amount is not a positive number.
5. Click on the "Burn" button. 

Expected Results:

- Notice pop-up to figure out Low balance or Invalid amount , thus  cannot be made successful.
```

### Create a token staking pool
```
Test Case ID: create_a_token_staking_pool_001
Test Case Description: This test case verifies the successful creation of a token staking pool

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. Make sure you have enough INW balance for transaction fee & a Azero for gas fee.
2. Navigate to the "Create" tab in the toolbar, then select "Token Staking Pool"
3. Choose the token you want to check by one of the 3 ways below:
- Scroll down and choose the token, the contract address of the token will be loaded, or
- Search the token name and choose the token, the contract address of the token will be loaded, or
- Paste the contract address, the token will be loaded
4. Fill in the required information as prompted including: 
- Pool length: must be a positive number
- Star date & time
- Annual Percentage Yield (APR) %: must be a positive number
- Total staking cap: must be a positive number
Make sure that the total caculated total rewards is not higher than your token balance.
4. Click on the "CREATE" button. Then, confirm this action with your wallet. 

Expected Results:

- The token staking pool is successfully created and displayed in "Pools" tab.
- Token balance is deducted with Total rewards
```

```
Test Case ID: create_a_token_staking_pool_002
Test Case Description: This test case verifies the successful creation of a token staking pool due to invalid contract address

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. Make sure you have enough INW balance for transaction fee & a Azero for gas fee.
2. Navigate to the "Create" tab in the toolbar, then select "Token Staking Pool"
3. Choose the token you want to check by one of the 2 ways below:
- Search the token name but no token resulted for the search, or
- Paste the contract address, but no token resulted for the search, or
4. Fill in the required information as prompted including: 
- Pool length: must be a positive number
- Star date & time
- Annual Percentage Yield (APR) %: must be a positive number
- Total staking cap: must be a positive number
Make sure that the total caculated total rewards is not higher than your token balance.
4. Click on the "CREATE" button

Expected Results:

- Notice pop-up to figure out Invalid Contract address, thus  cannot be made successful.
```

```
Test Case ID: create_a_token_staking_pool_003
Test Case Description: This test case verifies the unsuccessful creation of a token staking pool due to INW low balance or token low balance or invalid information

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. 
2. Navigate to the "Create" tab in the toolbar, then select "Token Staking Pool"
3. Choose the token you want to check by one of the 3 ways below:
- Scroll down and choose the token, the contract address of the token will be loaded, or
- Search the token name and choose the token, the contract address of the token will be loaded, or
- Paste the contract address, the token will be loaded
4. Fill in the invalid information as prompted including one of the followings: 
- Pool length: not a positive number, or
- Star date & time: not date & time format, or
- Annual Percentage Yield (APR) %: not a positive number, or
- Total staking cap: not a positive number, or
- The total caculated total rewards is higher than your token balance, or
- You do not have enough INW required for transaction fee
4. Click on the "CREATE" button. 

Expected Results:

- Notice pop-up to figure out Low balance or Invalid information , thus  cannot be made successful.
```

#### Remove rewards after pool ends
```
Test Case ID: remove_rewards_after_pool_ends_001
Test Case Description: This test case verifies the successful removal of rewards after pool ends

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. Make sure the pool has ended.
2. Navigate to the "Create" tab in the toolbar, then select "Token Staking Pool"
3. Scroll down and Choose the pool in "My staking pool" you want to remove rewards.
4. Fill in the amount of rewards you want to remove or simply click "Max" to remove the rest rewards.
5. Click on the "Remove rewards" button. Then, confirm this action with your wallet. 

Expected Results:

- The rewards is successfully removed and added up to your balance.
```

```
Test Case ID: remove_rewards_after_pool_ends_002
Test Case Description: This test case verifies the unsuccessful removal of rewards after pool ends due to invalid amount

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. Make sure the pool has ended.
2. Navigate to the "Create" tab in the toolbar, then select "Token Staking Pool"
3. Scroll down and Choose the pool in "My staking pool" you want to remove rewards.
4. Fill in the amount of rewards you want to remove but the amount is not a positive number or higher than the max rewards.
5. Click on the "Remove rewards" button. 

Expected Results:

- Notice pop-up to figure out Invalid amount , thus  cannot be made successful.
```


### Create an NFT yield farm
```
Test Case ID: create_an_NFT_yield_farm_001
Test Case Description: This test case verifies the successful creation of an NFT yield farm

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. Make sure you have enough INW balance for transaction fee & a Azero for gas fee.
2. Navigate to the "Create" tab in the toolbar, then select "NFT yield farm"
3. Choose the NFT Collection you want for the farm by one of the 3 ways below:
- Scroll down and choose the NFT Collection, the contract address of the yield farm will be loaded, or
- Search the NFT Collection and choose NFT Collection, the contract address of NFT Collection will be loaded, or
- Paste the contract address, the NFT Collection will be loaded
4. Choose the token you want to check by one of the 3 ways below:
- Scroll down and choose the token, the contract address of the token will be loaded, or
- Search the token name and choose the token, the contract address of the token will be loaded, or
- Paste the contract address, the token will be loaded
5. Fill in the required information as prompted including: 
- Pool length: must be a positive number
- Star date & time: must be in date & time format
- Multiplier: must be a positive number
- Total staking cap: must be a positive integer
Make sure that the total caculated total rewards is not higher than your token balance.
4. Click on the "CREATE" button. Then, confirm this action with your wallet. 

Expected Results:

- The NFT yield farm is successfully created and displayed in "Farms" tab.
- Token balance is deducted with Total rewards
- INW balance is deducted with transaction fee
```

```
Test Case ID: create_an_NFT_yield_farm_002
Test Case Description: This test case verifies the successful creation of an NFT yield farm due to invalid contract address 

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. Make sure you have enough INW balance for transaction fee & a Azero for gas fee.
2. Navigate to the "Create" tab in the toolbar, then select "NFT yield farm"
3. Choose the NFT Collection you want to check by one of the 2 ways below:
- Search the NFT Collection name but no NFT Collection resulted for the search, or
- Paste the contract address, but no NFT Collection resulted for the search, or
4. Choose the token you want to check by one of the 2 ways below:
- Search the token name but no token resulted for the search, or
- Paste the contract address, but no token resulted for the search
5. Fill in the required information as prompted including: 
- Pool length: must be a positive number
- Star date & time: must be in date & time format
- Multiplier: must be a positive number
- Total staking cap: must be a positive integer
Make sure that the total caculated total rewards is not higher than your token balance.
4. Click on the "CREATE" button.

Expected Results:

- - Notice pop-up to figure out Invalid Contract address, thus  cannot be made successful.
```

```
Test Case ID: create_an_NFT_yield_farm_003
Test Case Description: This test case verifies the unsuccessful creation of an NFT yield farm due to INW low balance or token low balance or invalid information

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. 
2. Navigate to the "Create" tab in the toolbar, then select "NFT yield farm"
3. Choose the NFT Collection you want for the farm by one of the 3 ways below:
- Scroll down and choose the NFT Collection, the contract address of the yield farm will be loaded, or
- Search the NFT Collection and choose NFT Collection, the contract address of NFT Collection will be loaded, or
- Paste the contract address, the NFT Collection will be loaded
4. Choose the token you want to check by one of the 3 ways below:
- Scroll down and choose the token, the contract address of the token will be loaded, or
- Search the token name and choose the token, the contract address of the token will be loaded, or
- Paste the contract address, the token will be loaded
5. Fill in the required information as prompted including: 
- Pool length: not a positive number, or
- Star date & time: not in date & time format, or
- Multiplier: not a positive number, or
- Total staking cap: not a positive integer, or
- The total caculated total rewards is higher than your token balance.
4. Click on the "CREATE" button. 

Expected Results:

- Notice pop-up to figure out Low balance or Invalid information , thus  cannot be made successful.
```

#### Remove rewards after farm ends
```
Test Case ID: remove_rewards_after_farm_ends_001
Test Case Description: This test case verifies the successful removal of rewards after farm ends

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. Make sure the pool has ended.
2. Navigate to the "Create" tab in the toolbar, then select "NFT Yield Farm"
3. Scroll down and Choose the pool in "My farms" you want to remove rewards.
4. Fill in the amount of rewards you want to remove or simply click "Max" to remove the rest rewards.
5. Click on the "Remove rewards" button. Then, confirm this action with your wallet. 

Expected Results:

- The rewards is successfully removed and added up to your balance.
```

```
Test Case ID: remove_rewards_after_farm_ends_002
Test Case Description: This test case verifies the unsuccessful removal of rewards after farm ends due to invalid amount

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. Make sure the pool has ended.
2. Navigate to the "Create" tab in the toolbar, then select "NFT Yield Farm"
3. Scroll down and Choose the pool in "My staking pool" you want to remove rewards.
4. Fill in the amount of rewards you want to remove but the amount is not a positive number or higher than the max rewards.
5. Click on the "Remove rewards" button. 

Expected Results:

- Notice pop-up to figure out Invalid amount , thus  cannot be made successful.
```

### Stake a Token
```
Test Case ID: stake_a_token_001
Test Case Description: This test case verifies the successful staking of a token in a pool

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. 
2. Navigate to the "Stake" tab in the toolbar, then select "Pools"
3. Choose or search the token you want to stake 
4. Fill in the positive amount of the token you want to stake. Make sure you have enough balance for staking
5. Click on the "Stake" button. Then, confirm this action with your wallet. 

Expected Results:

- "The stakes" amount is added up with the staking amount.
- "My unclaimed rewards" is getting added up with APY% every block
- Token balance is deducted with staking amount
```

```
Test Case ID: stake_a_token_002
Test Case Description: This test case verifies the unsuccessful staking of a token in a pool due invalid amount or low balance

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. 
2. Navigate to the "Stake" tab in the toolbar, then select "Pools"
3. Choose or search the token you want to stake 
4. Fill in a non-positive number of the token you want to stake or a positive number that is higher than the balance
5. Click on the "Stake" button. 

Expected Results:

- Notice pop-up to figure out Low balance or Invalid amount , thus  cannot be made successful.
```
#### Unstake a Token
```
Test Case ID: unstake_a_token_001
Test Case Description: This test case verifies the successful unstaking of a token in a pool

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. 
2. Navigate to the "Stake" tab in the toolbar, then select "Pools"
3. Choose or search the pool you want to unstake 
4. Fill in the positive amount of the token you want to unstake
5. Click on the "Unstake" button. Then, confirm this action with your wallet. 

Expected Results:

- "The stakes" amount is deducted with the unstaking amount.
- "My unclaimed rewards" is getting added up with APY% of the rest staking amount if any available every block
- Token balance is added with unstaking amount
```

```
Test Case ID: unstake_a_token_002
Test Case Description: This test case verifies the unsuccessful unstaking of a token in a pool due to invalid amount

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. 
2. Navigate to the "Stake" tab in the toolbar, then select "Pools"
3. Choose or search the pool you want to unstake 
4. Fill in the amount of the token you want to unstake but the amount is either not a positive number, or is higher than the amount you staked.
5. Click on the "Unstake" button. 

Expected Results:

- Notice pop-up to figure out Invalid amount , thus  cannot be made successful.
```

```
Test Case ID: unstake_a_token_003
Test Case Description: This test case verifies the unsuccessful unstaking of a token in a pool due INW low balance for transaction fee

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet.
2. Navigate to the "Stake" tab in the toolbar, then select "Pools"
3. Choose or search the pool you want to unstake 
4. Fill in the positive amount of the token you want to unstake, but INW balance is not enough to pay for transaction fee
5. Click on the "Unstake" button. 

Expected Results:

- Notice pop-up to figure out low INW balance, thus  cannot be made successful.
```

### Stake an NFT 
```
Test Case ID: stake_an_NFT_001
Test Case Description: This test case verifies the successful staking of an NFT in a farm

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. 
2. Navigate to the "Stake" tab in the toolbar, then select "Farms"
3. Choose or search the farm you want to stake 
4. Choose the NFT in the "Available NFTs" you want to stake. 
5. Click on the "Stake" button. Then, confirm this action with your wallet. 

Expected Results:

- "My stakes" amount is added up with 1 more NFT.
- "My unclaimed rewards" is getting added up with APY% every block
```

#### Unstake an NFT
```
Test Case ID: unstake_an_NFT_001
Test Case Description: This test case verifies the successful unstaking of an NFT in a farm

Test Steps:

1. Open the Ink Whale platform & connect to an Aleph Zero native wallet. 
2. Navigate to the "Stake" tab in the toolbar, then select "Farms"
3. Choose or search the farm you want to unstake 
4. Choose the NFT in the "Staked NFTs" you want to unstake.
5. Click on the "Unstake" button. Then, confirm this action with your wallet. 

Expected Results:

- "My stakes" amount is deducted with 1 more NFT.
- "My unclaimed rewards" is getting added up  APY% of the rest staking amount if any available every block
```

### Admin
    - [Claim balance](#Claim-balance)


