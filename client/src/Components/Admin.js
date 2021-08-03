import React from "react";
import Certification from '../contracts/Certification.json'
import Web3 from 'web3'

class GenerateForm extends React.Component {
    state = {
        owner: '0x0',
        isOwner: false,
        certification: {},
        renderLoading: true,
        renderAdmin: false,
        renderMetaMaskError: false
    };

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockChainData()
    }



    // check if this is a metamask enabled browser

    // way to connect first way
    async loadWeb3() {
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
    async loadBlockChainData() {
        const web3 = window.web3
        try {
            const accounts = await web3.eth.getAccounts()
            console.log('checking accounts')
            console.log(accounts)
            let caller = accounts[0]
            this.setState({ account: accounts[0] })

            const networkId = await web3.eth.net.getId()

            // Load certification contract
            const certificationData = Certification.networks[networkId]
            if (certificationData) {
                // create a web3 version of the contract
                const certification = new web3.eth.Contract(Certification.abi, certificationData.address)
                this.setState({ certification })
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
                    let smartContractOwner = await certification.methods.owner().call()
                    console.log(smartContractOwner)

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
