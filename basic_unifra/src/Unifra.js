const Web3 = require("web3")
require('dotenv').config();

class Unifra {
    // read HTTP APP UNIFRA KEY from the '.env' file
    static HTTP_UNIFRA_KEY  = process.env.HTTP_UNIFRA_KEY;
    // Read private key from the '.env' file
    static ESPACE_PRIVATE_KEY = process.env.SENDER_PRIVATE_KEY;
    // read Receiver Address from the '.env' file
    static ESPACE_RECEIVER = process.env.RECEIVER_ESPACE_ADDRESS;

    static async getBalance(address) {
        const web3 = new Web3(Unifra.HTTP_UNIFRA_KEY);
        const balance = await web3.eth.getBalance(address);

        return balance;
    }

    static async getNextNonce(address) {
        const web3 = new Web3(Unifra.HTTP_UNIFRA_KEY);
        const nonce = await web3.eth.getTransactionCount(address, "pending");
    
        return nonce;
    }

    static async generateAccountFromPK(pk) {
        const web3 = new Web3(Unifra.HTTP_UNIFRA_KEY);
        const account = await web3.eth.accounts.privateKeyToAccount(pk);
        
        return account;
    }

    static async getGasPrice() {
        const web3 = new Web3(Unifra.HTTP_UNIFRA_KEY);
        const gasPrice = await web3.eth.getGasPrice();
        return gasPrice;
    }

    static async signTransaction(tx, pk) {
        const web3 = new Web3(Unifra.HTTP_UNIFRA_KEY);
        const signed = web3.eth.accounts.signTransaction(tx, pk);
        return signed;
    }

    static async sendTransaction(raw) {
        try {
            const web3 = new Web3(Unifra.HTTP_UNIFRA_KEY);
            const { transactionHash } = await web3.eth.sendSignedTransaction(raw);
            return transactionHash;
        } catch(e) {
            console.error(e);
        }
    }
}

module.exports = Unifra;
