import React from "react";
import Institution from '../contracts/Institution.json'
import Web3 from 'web3'

class GenerateForm extends React.Component {
    state = {
        owner: '0x0',
        isOwner: false,
        institute: {},
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
            // this.setState({ account: accounts[0] })

            const networkId = await web3.eth.net.getId()

            // Load institurion contract
            const institutionData = Institution.networks[networkId]
            if (institutionData) {
                // create a web3 version of the contract
                const institution = new web3.eth.Contract(Institution.abi, institutionData.address)
                this.setState({ institution })
                try {
                    // let owner = await certification.methods.checkOwner().call()
                    // console.log(owner)
                    // let sender = await certification.methods.checkSender()
                    // .send({from: this.state.account}).on('receipt', function (receipt) {
                    // console.log(receipt);
                    // })
                    // sender.then(res => {
                    //     console.log("response")
                    //     console.log(res)
                    // }
                    // )
                    // console.log(sender)
                    // console.log(sender.events.UserRegisterEVENT.returnValues)

                    // get owner of smart contract
                    let smartContractOwner = await institution.methods.owner().call()
                    console.log(smartContractOwner)

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

            }
        }
        catch {
            window.alert('No accounts detected')
        }
    }

    Tharun, [06.08.21 22: 10]
    // let certification, institution;
    // let mockOwnerAcc = accounts[0];
    // let mockCert = {
    //     candidateName: "John Lim",
    //     orgName: "Singapore University of Technology and Design",
    //     courseName: "Computer Science and Design",
    //     expirationDate: new Date().getTime(),
    //     id: "5c0157fd3ff47a2a54075b01",
    // };
    // let mockToken = "5c0157fd3ff47a2a54075b02";
    // let mockInstitute = {
    //     instituteName: "Singapore University of Technology and Design",
    //     instituteAcronym: "SUTD",
    //     instituteLink: "https://sutd.edu.sg/",
    // };
    // let mockInstituteCourses = [{
    //         course_name: "Computer Science and Design",
    //     },
    //     {
    //         course_name: "Engineering Product and Development",
    //     },
    //     {
    //         course_name: "Engineering Systems and Design",
    //     },
    //     {
    //         course_name: "Architecture and Sustainable Design",
    //     },
    // ];

    async addInstituteToBlockchain() {
        console.log("adding institute to the blockchain")

    }



    switchLoading = () => {
        const { renderLoading } = this.state
        console.log('switching loading')
        switch (renderLoading) {
            case true:
                return 'Loading'
            case false:
                return ''
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
                {renderLoading ? (<h1>Loading</h1>) :
                    renderMetaMaskError ? (<h1>Metamask issue</h1>) :
                        renderAdmin ? (<h1>Access granted</h1>) :
                            (<h1>Not admin</h1>)}
            </>
        );
    }
}

export default GenerateForm