require('dotenv').config();
const Crypto = require('./crypto');
//const database = require('../integrations/database');

describe('database integration test', () => {
	const testSet = [
		['123-45-6780', '89lD1dezbO14+LTUsfEsbsRqv/DJ8shHheHt4AwFkzQ='],
		['234-56-7899', 'y3PZizd6aJrugeRJ5cBqqYM/09YYvLsTSzHGOS1J72g='],
		['345-67-8900', '8cl/njUIOyD+mF0GYP1Zebe/4KV+oZ0Ix4duSrZteyA='],
	];

	it('gets table results from DB', async () => {
		// const password = 'This is my encryption key';
		// const algorithm = 'TRIPLE DES with 128 bit encryption';
		// const salt = 'Ivan Medvedev';
		// const salt = new Uint8Array([
		// 	0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64,
		// 	0x65, 0x76,
		// ]);

		// const derived = Crypto.PasswordDeriveBytes(
		// 	password,
		// 	salt,
		// 	undefined,
		// 	undefined,
		// 	48
		// );
		// const iv = Crypto.PasswordDeriveBytes(
		// 	password,
		// 	salt,
		// 	undefined,
		// 	undefined,
		// 	16
		// );
		//console.log({ key: Uint8Array.from(key), iv: Uint8Array.from(iv) });

		const key = new Uint8Array([
			15, 208, 212, 184, 178, 18, 148, 26, 97, 253, 11, 186, 111, 210,
			124, 62, 101, 144, 13, 160, 69, 212, 174, 150, 238, 1, 13, 198, 212,
			153, 201, 113,
		]);
		const iv = new Uint8Array([
			97, 253, 11, 186, 111, 210, 124, 62, 170, 136, 168, 14, 144, 43, 28,
			162,
		]);
		const crypto = new Crypto({ key, iv });

		expect(crypto).toBeTruthy();
		for (const [expected, encrypted] of testSet) {
			const result = crypto.decryptDesperate(
				Buffer.from(encrypted, 'base64')
			);
			//console.log(`GOT = ${result}, EXPECTED = ${expected}`);
			expect(result).toEqual(expected);
		}
	});

	it('gets table results from DB, with base64 encoded key and iv', async () => {
		//TODO: checking this in is very bad - we should update DB encryption keys before going live!!!
		const crypto = new Crypto({
			key: 'D9DUuLISlBph/Qu6b9J8PmWQDaBF1K6W7gENxtSZyXE=',
			iv: 'Yf0Lum/SfD6qiKgOkCscog==',
		});

		expect(crypto).toBeTruthy();
		for (const [expected, encrypted] of testSet) {
			const result = crypto.decryptDesperate(
				Buffer.from(encrypted, 'base64')
			);
			//console.log(`GOT = ${result}, EXPECTED = ${expected}`);
			expect(result).toEqual(expected);
		}
	});

	// this should only work locally, not in CI tests
	it.skip('gets table results from DB, with .env', async () => {
		const crypto = new Crypto();

		expect(crypto).toBeTruthy();
		for (const [expected, encrypted] of testSet) {
			const result = crypto.decryptDesperate(
				Buffer.from(encrypted, 'base64')
			);
			//console.log(`GOT = ${result}, EXPECTED = ${expected}`);
			expect(result).toEqual(expected);
		}
	});
});

// C# reference code
/*
using System;
using System.Data;
using System.IO;                        // Added
using System.Security.Cryptography;     // Added
using Microsoft.SqlServer.Dts.Pipeline.Wrapper;
using Microsoft.SqlServer.Dts.Runtime.Wrapper;
using System.Windows.Forms;

[Microsoft.SqlServer.Dts.Pipeline.SSISScriptComponentEntryPointAttribute]
public class ScriptMain : UserComponent
{
    public override void Input0_ProcessInputRow(Input0Buffer Row)
    {
        Row.EncryptedString = Encrypt(Row.strvalue, this.Variables.EncryptionKey.ToString());
        Row.UnencryptedString = Row.strvalue;
    }

	public static string Encrypt(string clearText, string EncryptText)
    {
        // Convert EncryptText string into byte array
        byte[] clearBytes = System.Text.Encoding.Unicode.GetBytes(clearText);

        // Create Key and IV from the EncryptText with salt technique
        PasswordDeriveBytes pdb = new PasswordDeriveBytes(
			EncryptText,
			new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 }
		);

        // Create a symmetric algorithm with Rijndael
        Rijndael alg = Rijndael.Create();

        // Set Key and IV   
        alg.Key = pdb.GetBytes(32);
        alg.IV = pdb.GetBytes(16);

        // Create a MemoryStream
        MemoryStream ms = new MemoryStream();

        // Create a CryptoStream
        CryptoStream cs = new CryptoStream(ms, alg.CreateEncryptor(), CryptoStreamMode.Write);

        // Write the data and make it do the encryption 
        cs.Write(clearBytes, 0, clearBytes.Length);

        // Close CryptoStream
        cs.Close();

        // Get Encypted data from MemoryStream
        byte[] encryptedData = ms.ToArray();

        // return the Encypted data as a String
        return Convert.ToBase64String(encryptedData);
    }

    // Decrypt text with Rijndael encryption
    public static string Decrypt(string cipherText, string EncryptText)
    {
        // Convert EncryptText string into byte array
        byte[] cipherBytes = Convert.FromBase64String(cipherText);

        // Create Key and IV from the EncryptText with salt technique
        PasswordDeriveBytes pdb = new PasswordDeriveBytes(EncryptText, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });

        // Create a symmetric algorithm with Rijndael
        Rijndael alg = Rijndael.Create();

        // Set Key and IV
        alg.Key = pdb.GetBytes(32);
        alg.IV = pdb.GetBytes(16);

        // Create a MemoryStream  
        MemoryStream ms = new MemoryStream();

        // Create a CryptoStream 
        CryptoStream cs = new CryptoStream(ms, alg.CreateDecryptor(), CryptoStreamMode.Write);

        // Write the data and make it do the decryption 
        cs.Write(cipherBytes, 0, cipherBytes.Length);

        // Close CryptoStream
        cs.Close();

        // Get Decypted data from MemoryStream
        byte[] decryptedData = ms.ToArray();

        // return the Decypted data as a String
        return System.Text.Encoding.Unicode.GetString(decryptedData);
    }
}

*/

// C# encrypt results
/*

rownum	strvalue	encryptedvalue	UnencryptedValue
1	123-45-6780	89lD1dezbO14+LTUsfEsbsRqv/DJ8shHheHt4AwFkzQ=	123-45-6780
2	234-56-7899	y3PZizd6aJrugeRJ5cBqqYM/09YYvLsTSzHGOS1J72g=	234-56-7899
3	345-67-8900	8cl/njUIOyD+mF0GYP1Zebe/4KV+oZ0Ix4duSrZteyA=	345-67-8900

*/

// C# troubleshooting (run this at https://dotnetfiddle.net/)
/*
using System;
using System.IO;                        // Added
using System.Security.Cryptography;     // Added
			
public class Program
{
	public static void Main()
	{
		
		Console.WriteLine(Decrypt("89lD1dezbO14+LTUsfEsbsRqv/DJ8shHheHt4AwFkzQ=", "This is my encryption key"));
	}

    // Decrypt text with Rijndael encryption
    public static string Decrypt(string cipherText, string EncryptText)
    {
        // Convert EncryptText string into byte array
        byte[] cipherBytes = Convert.FromBase64String(cipherText);
		//Console.WriteLine(string.Join(", ", cipherBytes));

        // Create Key and IV from the EncryptText with salt technique
        PasswordDeriveBytes pdb = new PasswordDeriveBytes(EncryptText, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });

        // Create a symmetric algorithm with Rijndael
        Rijndael alg = Rijndael.Create();

        // Set Key and IV
		byte[] key = pdb.GetBytes(32);
		byte[] iv = pdb.GetBytes(16);
		Console.WriteLine(string.Join(", ", key));
		Console.WriteLine();
		Console.WriteLine(string.Join(", ", iv));

        alg.Key = key;
        alg.IV = iv;

        // Create a MemoryStream  
        MemoryStream ms = new MemoryStream();

        // Create a CryptoStream 
        CryptoStream cs = new CryptoStream(ms, alg.CreateDecryptor(), CryptoStreamMode.Write);

        // Write the data and make it do the decryption 
        cs.Write(cipherBytes, 0, cipherBytes.Length);

        // Close CryptoStream
        cs.Close();

        // Get Decypted data from MemoryStream
        byte[] decryptedData = ms.ToArray();

		Console.WriteLine();
		Console.WriteLine(string.Join(", ", decryptedData));

        // return the Decypted data as a String
        return System.Text.Encoding.Unicode.GetString(decryptedData);
    }
}
*/
