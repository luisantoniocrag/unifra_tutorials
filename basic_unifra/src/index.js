const Unifra = require("./Unifra");

(async function main() {
    const {
        getBalance,
        getGasPrice,
        getNextNonce,
        generateAccountFromPK,
        signTransaction,
        sendTransaction,
        ESPACE_PRIVATE_KEY,
        ESPACE_RECEIVER,
    } = Unifra;

    // get prev balance of CFX
    const prevBalance = await getBalance(ESPACE_RECEIVER);
    console.log(`Prev balance: ${(Number(prevBalance) / 10**18)} CFX`);

    // generate the account from our private_key to get the nonce and address related to it
    const account = await generateAccountFromPK(ESPACE_PRIVATE_KEY);
    const nonce = await getNextNonce(account.address);
    const senderBalance = await getBalance(account.address);

    /**
     * Check if sender address has enough balance to send 1 CFX
     * Note: 1 CFX = 10^18 Drip
     *       and 1.1 CFX = 1100000000000000000 Drip
     */
    if (senderBalance >= 1100000000000000000) {
        /**
         * This is the basic structure for seding a transaction
         * 
         * from: string,
         * to: string,
         * value: number in Drip units
         * gas: number,
         * nonce: number,
         * gasPrice: number,
         * data: string  | as we aren't calling a smart contract function or creating a new one we don't need to add data field
         */
        const tx = {
            from: account.address,         // sender address (optional)
            to: ESPACE_RECEIVER,           // receiver address
            value: 10**18,                // units in Drip
            gas: 21000,                    // minimum used for this type of transaction (we are not calling a smart contract function for example)
            nonce,                         // transaction identifier for the sender address, this is unique and progressive; 1,2,3,4...
            gasPrice: await getGasPrice(), // get the most recent price of gas
        }

        // once we have our tx we need to sign our intention to send before with the private key of the sender.
        console.log("Signing Transaction...")
        const txSigned = await signTransaction(tx, ESPACE_PRIVATE_KEY);

        // once signed just send it 
        console.log("Sending Transaction...");
        const sendTx = await sendTransaction(txSigned.rawTransaction)

        // wait 10 seconds and display the transaction hash and new receiver balance
        // in order to confirm that the transaction has been success.
        console.log("Confirming Transaction...")
        setTimeout(async () => {
            console.log("Hash:", sendTx)

            const newReceiverBalance = await getBalance(ESPACE_RECEIVER)
            console.log(`New balance: ${(Number(newReceiverBalance) / 10**18)} CFX`)
        }, 10000)
    } 
    else return console.log({ success: false, message: "Sender does not have enough balance"});

})();
