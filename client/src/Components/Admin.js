import React from "react";
import Institution from '../contracts/Institution.json'
import Web3 from 'web3'
import { v4 as uuidv4 } from 'uuid';
import contract from 'truffle-contract'
const InstitutionInstance = contract(Institution)

class Admin extends React.Component {
    state = {
        owner: '0x0',
        isOwner: false,
        institution: {},
        renderLoading: true,
        renderAdmin: false,
        renderMetaMaskError: false


    };

    async componentWillMount() {
        await this.loadWeb3Metamask()
        await this.loadBlockChainDataAndCheckAdmin()
    }

    // way to connect first way
    async loadWeb3Metamask() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
            this.setState({
                renderLoading: false,
                renderMetaMaskError: true
            })
        }
    }

    // Load contract
    async loadBlockChainDataAndCheckAdmin() {
        const web3 = window.web3
        try {
            const accounts = await web3.eth.getAccounts()
            console.log('checking accounts')
            console.log(accounts)
            let caller = accounts[0]

            const networkId = await web3.eth.net.getId()

            // Load institution contract
            const institutionData = Institution.networks[networkId]
            if (institutionData) {
                // create a web3 version of the contract
                const institution = new web3.eth.Contract(Institution.abi, institutionData.address)
                this.setState({ institution })
                try {
                    // get owner of smart contract
                    let smartContractOwner = await institution.methods.owner().call()

                    // compare the caller and the owner of smart contract
                    if (caller == smartContractOwner) {
                        // give access to the page
                        this.setState({
                            renderLoading: false,
                            renderMetaMaskError: false,
                            renderAdmin: true
                        })
                    }
                    else {
                        this.setState({
                            renderLoading: false,
                            renderMetaMaskError: false,
                            renderAdmin: false
                        })
                        window.alert('You are not the admin')
                    }
                }
                catch (error) {
                    console.log(error)
                }
            }
            else {
                window.alert('Institution contract not deployed to network')
                this.setState({
                    renderLoading: false,
                    renderMetaMaskError: true,
                    renderAdmin: false
                })
            }
        }
        catch {
            // window.alert('No accounts detected')
            console.log("no accounts detected")
        }
    }



    async addInstituteToBlockchain() {
        console.log("adding institute to the blockchain")
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        let caller = accounts[0]

        let unique_id = uuidv4()
        console.log(unique_id)
        let mockInstituteCourses = [{
            course_name: "Computer Science and Design",
        },
        {
            course_name: "Engineering Product and Development",
        },
        {
            course_name: "Engineering Systems and Design",
        },
        {
            course_name: "Architecture and Sustainable Design",
        },
        ];

        let address = unique_id;
        let mockInstitute = {
            instituteName: "Singapore University of Technology and Design",
            instituteAcronym: "SUTD",
            instituteLink: "https://sutd.edu.sg/",
        };

        const networkId = await web3.eth.net.getId()
        const institutionData = Institution.networks[networkId]
        const institution = new web3.eth.Contract(Institution.abi, institutionData.address)

        console.log(institution)
        try {
            // get owner of smart contract
            let smartContractOwner = await institution.methods.owner().call()

            // compare the caller and the owner of smart contract
            if (caller == smartContractOwner) {
                await institution.methods.addInstitute(
                    address,
                    mockInstitute.instituteName,
                    mockInstitute.instituteAcronym,
                    mockInstitute.instituteLink,
                    mockInstituteCourses
                )
                .send({ from: caller }).on('receipt', function (receipt) {
                    console.log(receipt);
                    console.log(receipt.events)
                })
            }
            else {
                window.alert('Not the account used to deploy smart contract')
            }
        }
        catch (error) {
            console.log(error.code)
            if (error.code == 4001) {
                window.alert('Transaction rejected')
            }
        }
    }


    render() {
        const {
            renderLoading,
            renderAdmin,
            renderMetaMaskError,
        } = this.state;
        return (
            <>
                {
                    renderLoading ? (<h1>Loading</h1>) :
                        renderMetaMaskError ? (<h1>Metamask issue</h1>) :
                            renderAdmin ? (<h1>Access granted</h1>) :
                                (<h1>Not admin</h1>)

                }
                {renderAdmin ? <button onClick={this.addInstituteToBlockchain}>
                    Add institute
                </button>: <></>}
            </>
        );
    }
}

export default Admin