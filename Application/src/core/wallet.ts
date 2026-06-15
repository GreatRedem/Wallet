import { ethers } from 'ethers';

class WalletManager
{
    private readonly WalletAddress: string;
    private readonly WalletDerive: ethers.HDNodeWallet;

    /**
     * Constructor - Initializes a wallet manager from a mnemonic phrase
     * @param {string} mnemonic - The BIP39 mnemonic phrase
     * @param {number} index - The wallet derivation index path
     */
    public constructor(mnemonic: string, index: number)
    {
        const normalized = mnemonic.normalize('NFKD');

        const wallet = ethers.HDNodeWallet.fromPhrase(normalized, '', `m/44'/60'/0'`);

        this.WalletDerive = wallet.derivePath(`0/${ index }`);
        this.WalletAddress = this.WalletDerive.address;
    }

    /**
     * retrieve - Returns the public and private keys of the derived wallet
     * @returns {Object} Object containing Public and Private key strings
     */
    public retrieve()
    {
        return { Public: this.WalletDerive.address, Private: this.WalletDerive.privateKey };
    }

    /**
     * sign - Signs a message using the wallet's private key
     * @param {string | Uint8Array} message - The message to sign
     * @returns {Promise<string>} The signature string
     */
    public async sign(message: string | Uint8Array)
    {
        return this.WalletDerive.signMessage(message);
    }

    /**
     * verify - Verifies that a signature was created by this wallet
     * @param {string} message - The original message
     * @param {string} signature - The signature to verify
     * @returns {boolean} True if signature is valid for this wallet, false otherwise
     */
    public verify(message: string, signature: string)
    {
        return ethers.verifyMessage(message, signature) === this.WalletAddress;
    }

    /**
     * toString - Returns the wallet address as a string
     * @returns {string} The wallet address
     */
    public toString()
    {
        return this.WalletAddress;
    }

    /**
     * Generate - Generates a new random BIP39 mnemonic phrase
     * @returns {string} A new mnemonic phrase
     */
    public static Generate()
    {
        const wallet = ethers.Wallet.createRandom();

        return wallet.mnemonic?.phrase;
    }

    /**
     * Validate - Validates if a mnemonic phrase is valid BIP39
     * @param {string} mnemonic - The mnemonic phrase to validate
     * @returns {boolean} True if the mnemonic is valid, false otherwise
     */
    public static Validate(mnemonic: string)
    {
        return ethers.Mnemonic.isValidMnemonic(mnemonic);
    }

    /**
     * Verify - Recovers the wallet address from a signed message
     * @param {string} message - The original message
     * @param {string} signature - The signature
     * @returns {string} The recovered wallet address
     */
    public static Verify(message: string, signature: string)
    {
        return ethers.verifyMessage(message, signature);
    }
}

export default WalletManager;
