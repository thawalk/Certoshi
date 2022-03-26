# Certoshi - A Decentralized Certificate Issuance and Verification System powered by Ethereum Smart Contracts

![](https://i.imgur.com/fPlaUCp.jpg)

You can view the DEMO of the application [here](https://youtu.be/ZZOoJguZkeY)!! 🚀

You are welcome to visit the live website connected to the Ethereum Rinkeby network at https://certoshi.vercel.app/ 😁

[Click here to view other screenshots of our application!](#Use-Cases)

## Documentation Contents

- [Installation & Set Up](#Installation-&-Set-Up)
  - [Downloading repository](#Downloading-repository)
  - [Setting up Blockchain on Local Network](#Setting-up-Blockchain-on-Local-Network)
  - [Setting up Blockchain on Ethereum Rinkeby Test Network](#Setting-up-Blockchain-on-Ethereum-Rinkeby-Test-Network)
  - [Setting up Client Application](#Setting-up-Client-Application)
- [Security & Testing](#Security--Testing)
  - [Smart Contracts Funtionality Testing](#Smart-Contracts-Funtionality-Testing)
  - [Smart Contracts Security Testing & Analysis](#Smart-Contracts-Security-Testing-Analysis)
- [Use-Cases](#Use-Cases)
  - [Registering Institutes by Central Authority](#Use-Case-1-Registering-Institutes)
  - [Issuing Certificates by Institutes](#Use-Case-2-Issuing-Certificates)
  - [Issuing Certificates by Institutes](#Use-Case-2-Issuing-Certificates)
  - [Viewing Certificates by Employers/Public](#Use-Case-4-Viewing-Certificates)

---

## Installation & Set Up

Node Version Used: 14.16.1
NPM Version Used: 6.14.12

Add metamask plugin to your supported browser (chrome) from [here](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en) and login

Please follow the instructions below closely. As some packages are not well maintained, you may face some issues in installation. If you do face issues in installation, you may refer to [Debug.md](Debug.md) to view suggestions on how to debug.

### Downloading repository

```bash
git clone https://github.com/thawalk/Certoshi.git
cd Certoshi
```

### Setting up Blockchain on Local Network

There are two ways to set up local blockchain with Truffle Ganache, either with GUI or CLI.

1. Create a `.env` file

Populate the following environment variables:

```
LOCAL_ENDPOINT=http://127.0.0.1:8545
NETWORK_ID=1337
```

> The port number and network ID can be changed to your preference

> An example `.env.example` file is created for reference. You can copy and paste the contents of the file and edit the variables.

2. Download Truffle

Visit https://www.trufflesuite.com/truffle for more information

```bash
npm install -g truffle
```

> Truffle helps us with deployment, testing, migration, etc.

3. Install node dependencies

```bash
npm install
```

#### Option 1 - Using Ganache GUI

1. Download Ganache GUI

Visit [Truffle Ganache](https://www.trufflesuite.com/ganache) to download the application

2. Create a ganache workspace & run ganache blockchain network

Click on 'New Workspace' and under 'Add Project', select the `truffle-config.js` file in the Certoshi directory. This should create a new workspace project with the same truffle settings defined in the `truffle-config.js` file.

![](https://i.imgur.com/gnWVdrN.png)

![](https://i.imgur.com/hMZzFto.png)

Once created with the workspace open, the local ganache blockchain network should be running on the defined port and network ID.

> Note: This blockchain network will be running as long as the Ganache GUI Application is open with the workspace.

3. Deploy Smart Contracts

Npm scripts has been included for ease of contract deployment. You may view the commands used under `package.json` for better understanding

In the root directory of Certoshi

```bash
truffle compile
npm run deploy:local
```

#### Option 2 - Using Ganache CLI

In your terminal/bash

1. Install Ganache CLI

```bash
npm install -g ganache-cli
```

2. Run Ganache blockchain network

```bash
npm run ganache
```

In the root directory of Certoshi

3. Deploy Smart Contracts

```bash
npm run deploy:local
```

### Setting up Blockchain on Ethereum Rinkeby Test Network

For our application, we will be running it on the Rinkeby test network, feel free to use other test networks like Ropsten, just change the settings accordingly.

#### Getting ether on Rinkeby

Before you are able to deploy the smart contracts, you will need some ether in your account first. Visit the [Rinkeby faucet](https://faucet.rinkeby.io/) and follow the instructions on the page to get some ether transferred to your account.

#### Deploying Smart Contracts

We will be using Infura to help us deploy easily on our development set up with truffle.
Visit [Infura](https://infura.io/) to create an ethereum project. Click on settings and change the 'endpoints' to Rinkeby and copy the endpoint link for the environment variables below.  
For the mnemonic, use your metamask account mneumonic.

```
PROJECT_ENDPOINT=https://rinkeby.infura.io/v3/12345
MNEMONIC="<your account's mnemonic with the ether on rinkeby>"
```

Connect to the rinkeby test network in your metamask and then, deploy the smart contracts.

```bash
npm run deploy:testnet
```

> Alternatively, may use [Ethereum's Remix](https://remix.ethereum.org/) for smart contract development and deployment as well, without using Infura.

> Regardless, we will be using Infura on our client application as well, and will reuse this endpoint.

### Setting up Client Application

The client application (which is built with [React.js](https://reactjs.org/)) is located under the `/client` folder in the directory.

```bash
cd client
```

1. Install dependencies

```bash
npm install
```

2. Create a `.env`file

Populate the following environment variables:

```
REACT_APP_INFURA_PROJECT_ENDPOINT=https://rinkeby.infura.io/v3/12345
REACT_APP_LOCAL_ENDPOINT=http://127.0.0.1:8545
REACT_APP_NETWORK_ID=1337
```

> The port number and network ID can be changed to your preference
> Use the same Infura project endpoint with instructions given above

> An example `.env.example` file is created for reference. You can copy and paste the contents of the file and edit the variables.

3. Start application

### Option 1 - To connect to local blockchain network

```bash
npm start
```

To use the front-end application running at http://localhost:3000/, connect to the Localhost Network in metamask

![](https://i.imgur.com/pjkb80e.png)

Import in the account that you used to deploy the contracts using the private key of the account, you can find it in the key symbol of the Ganache UI beside your account.

![](https://i.imgur.com/f090jmt.png)

### Option 2 - To connect to Rinkeby test network

```bash
npm run start:testnet
```

To use the front-end application running at http://localhost:3000/, connect to the Rinkeby Test Network in metamask and use the account that you used to deploy the contracts.

![](https://i.imgur.com/m2W1PUI.png)


> This will connect to the Rinkeby network with Infura, only for viewing of certificates. The other functions uses the Ethereum-based browsers (connected to Metamask wallets) to access the network.

---

## Security & Testing

### Smart Contracts Funtionality Testing

This will run the testing files with the test cases defined the files, located under `/test` folder
Make sure the local ganache blockchain network is running first before testing. Testing will be done on the local network.

```bash
truffle test
```

> If these test cases pass, you are good. If not, please double check the local blockchain network is set up correctly (especially the Port number and network ID)

### Smart Contracts Security Testing & Analysis

We are using Mythrill to conduct security analysis of our Smart Contracts - `Institutions.sol` and `Certification.sol`.
This will be run on Docker images, so make sure you have [Docker](https://www.docker.com/) on your machine.

```bash
# Set up
docker pull mythril/myth
docker run mythril/myth --help
docker run mythril/myth disassemble -c "0x6060"

# Mounting and Running analysis on Smart Contracts
docker run -v %(cd)%:/contracts mythril/myth analyze /contracts/Institutions.sol
docker run -v %(cd)%:/contracts mythril/myth analyze /contracts/Certification.sol
```

> Refer to the [Mythrill documentation](https://mythril-classic.readthedocs.io/en/master/installation.html) if you need instructions running on other OS

---

## Use-Cases

You are welcome to visit the live website connected to the Ethereum Rinkeby network at https://certoshi.vercel.app/ 😁

There are **4 main Use Cases**:

[1. **Registering Institutes** by Central Authority](#Use-Case-1-Registering-Institutes)

[2. **Issuing Certificates** by Institutes](#Use-Case-2-Issuing-Certificates)

[3. **Revoking Certificates** by Institutes](#Use-Case-3-Revoking-Certificates)

[4. **Viewing Certificates** by Employers/Public](#Use-Case-4-Viewing-Certificates)

> For Use Cases 1 to 3, [Metamask](https://metamask.io/) extension is needed to connect to the Ethereum Rinkeby network, as well as the required authorizations.

> Use Case 4 can be accessed by anyone on any browser

🔽 Here are some additional screenshots of our application to view how it works!

### Use Case 1: Registering Institutes

Interface to Register an Institute
![](https://i.imgur.com/gwi9dId.jpg)

Confirmation on Registering an Institute
![](https://i.imgur.com/VtmqS1F.jpg)

Success on Registering an Institute
![](https://i.imgur.com/BadkZi8.jpg)

Unauthorized Access to page for Registering Institutes
![](https://i.imgur.com/ZZ9wwSP.jpg)

### Use Case 2: Issuing Certificates

Interface to Issue a Certificate
![](https://i.imgur.com/ohcU6oD.jpg)

Success on Issuing a Certificate
![](https://i.imgur.com/FurGKID.jpg)

Unauthorized Access to page for Issuing Certificates
![](https://i.imgur.com/b8IVIrq.jpg)

### Use Case 3: Revoking Certificates

Interface to Revoke a Certificate
![](https://i.imgur.com/WiUwAWb.jpg)

Success on Revoking a Certificate
![](https://i.imgur.com/0CF7wpF.jpg)

Certificate before it is revoked
![](https://i.imgur.com/v4zTt0y.jpg)

Certificate after it is revoked
![](https://i.imgur.com/Zd6kJfG.jpg)

### Use Case 4: Viewing Certificates

Interface to enter Certificate ID to view Certificate
![](https://i.imgur.com/AVGQBPd.jpg)

Example of Verified Certificate
![](https://i.imgur.com/SUXWxyU.jpg)

Additional Information of a Verified Certificate
![](https://i.imgur.com/ipSe2CW.jpg)

Example of a Revoked Certificate
![](https://i.imgur.com/2EJgWQu.jpg)

Additional Information of a Revoked Certificate
![](https://i.imgur.com/y8RY03L.jpg)

Accessing an Invalid Certificate
![](https://i.imgur.com/iY61dQZ.jpg)

### Others

Accessing Use Cases 1 to 3 on a normal browser without Metamask
![](https://i.imgur.com/imSzQpj.jpg)

---

## Team Members

- [Tharun Adhi Narayan](https://github.com/thawalk)
- [Wong Ye Qi Daryll](https://github.com/daryllman)
- [Akmal Hakim Teo](https://github.com/Akmalhakimteo)
