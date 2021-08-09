import React from "react";
import Institution from '../contracts/Institution.json'
import Web3 from 'web3'
import { v4 as uuidv4 } from 'uuid';
import TextField from '@material-ui/core/TextField';

class Admin extends React.Component {
    state = {
        owner: '0x0',
        isOwner: false,
        institution: {},
        renderLoading: true,
        renderAdmin: false,
        renderMetaMaskError: false,
        instituteAddress: "",
        instituteName: "",
        instituteAcronym: "",
        instituteWebsite: "",
        course: "",
        // instituteCourses: new Array()
        instituteCourses: []
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

        //------------ mock data -----------------//
        // let instituteAddress = uuidv4()

        // let instituteAddress = "0x83E41c66E7EE0f14d0Fc8E74720652F6662eB1Eb"

        // let mockInstituteCourses = [{
        //     course_name: "Computer Science and Design",
        // },
        // {
        //     course_name: "Engineering Product and Development",
        // },
        // {
        //     course_name: "Engineering Systems and Design",
        // },
        // {
        //     course_name: "Architecture and Sustainable Design",
        // },
        // ];

        // let mockInstitute = {
        //     instituteName: "Singapore University of Technology and Design",
        //     instituteAcronym: "SUTD",
        //     instituteLink: "https://sutd.edu.sg/",
        // };
        //------------ mock data -----------------//

        // instantiate the contract (---can't maintain it in a state for some reason, need to check again later----)
        const networkId = await web3.eth.net.getId()
        const institutionData = Institution.networks[networkId]
        const institution = new web3.eth.Contract(Institution.abi, institutionData.address)
        try {
            // get owner of smart contract
            let smartContractOwner = await institution.methods.owner().call()

            // compare the caller and the owner of smart contract
            if (caller == smartContractOwner) {

                //------------ mock data -----------------//
                // await institution.methods.addInstitute(
                //     instituteAddress,
                //     mockInstitute.instituteName,
                //     mockInstitute.instituteAcronym,
                //     mockInstitute.instituteLink,
                //     mockInstituteCourses
                // )
                //------------ mock data -----------------//

                await institution.methods.addInstitute(
                    this.state.instituteAddress,
                    this.state.instituteName,
                    this.state.instituteAcronym,
                    this.state.instituteWebsite,
                    this.state.instituteCourses
                )
                    .send({ from: caller }).on('receipt', function (receipt) {
                        console.log(receipt);
                        console.log(receipt.events)
                        //-------clearing the value, doesn't work, check this please----------//
                        // this.setState({
                        //     instituteAddress:"",
                        //     instituteName:"",
                        //     instituteAcronym: "",
                        //     instituteWebsite: "",
                        //     course: ""
                        // })

                        // ----- here can use a state or smth, to display a success message -----
                    })
            }
            else {
                window.alert('Not the account used to deploy smart contract')
            }
        }
        catch (error) {
            console.log(error)
            console.log(error.code)
            if (error.code == -32603) {
                window.alert('Institute account already exits')
            }
            else if (error.code == 4001) {
                window.alert('Transaction rejected')
            }
            else {
                window.alert('Institute account address is not legit')
            }
        
        }
    }


check() {
    console.log(this.state.instituteCourses)
}
handleTextFieldChangeAddress(e) {
    this.setState({
        instituteAddress: e.target.value
    })
}

handleTextFieldChangeName(e) {
    this.setState({
        instituteName: e.target.value
    })
}
handleTextFieldChangeAcronym(e) {
    this.setState({
        instituteAcronym: e.target.value
    })
}
handleTextFieldChangeWebsite(e) {
    this.setState({
        instituteWebsite: e.target.value
    })
}
handleTextFieldChangeCourse(e) {
    this.setState({
        course: e.target.value
    })
}

appendToCourseList() {
    this.setState({
        instituteCourses: [...this.state.instituteCourses, { course_name: this.state.course }],
        course: ""
    })
    console.log(this.state.instituteCourses)
}


render() {
    const {
        renderLoading,
        renderAdmin,
        renderMetaMaskError,
        course,
        instituteWebsite,
        instituteAddress,
        instituteAcronym,
        instituteName
    } = this.state;
    return (
        <>
            {
                renderLoading ? (<h1>Loading</h1>) :
                    renderMetaMaskError ? (<h1>Metamask issue</h1>) :
                        renderAdmin ? (<h1>Access granted</h1>) :
                            (<h1>Not admin</h1>)

            }
            {renderAdmin ?
                <>

                    <TextField
                        // add a error function to ensure they don't submit empty strings
                        // error={error}
                        autoFocus
                        margin="dense"
                        id="address"
                        label="Institute Account Address"
                        type="name"
                        value={instituteAddress}
                        fullWidth
                        // helperText={helperText}
                        onChange={(e) => this.handleTextFieldChangeAddress(e)}
                    />
                    <TextField
                        // add a error function to ensure they don't submit empty strings
                        // error={error}
                        autoFocus
                        margin="dense"
                        id="address"
                        label="Institute Name"
                        type="name"
                        value={instituteName}
                        fullWidth
                        // helperText={helperText}
                        onChange={(e) => this.handleTextFieldChangeName(e)}
                    />
                    <TextField
                        // add a error function to ensure they don't submit empty strings
                        // error={error}
                        autoFocus
                        margin="dense"
                        id="address"
                        label="Institute Acronym"
                        type="name"
                        value={instituteAcronym}
                        fullWidth
                        // helperText={helperText}
                        onChange={(e) => this.handleTextFieldChangeAcronym(e)}
                    />
                    <TextField
                        // add a error function to ensure they don't submit empty strings
                        // error={error}
                        autoFocus
                        margin="dense"
                        id="address"
                        label="Institute Website"
                        type="name"
                        value={instituteWebsite}
                        fullWidth
                        // helperText={helperText}
                        onChange={(e) => this.handleTextFieldChangeWebsite(e)}
                    />
                    <TextField
                        // add a error function to ensure they don't submit empty strings
                        // error={error}
                        autoFocus
                        margin="dense"
                        id="address"
                        label="Add course"
                        type="name"
                        fullWidth
                        value={course}
                        // helperText={helperText}
                        onChange={(e) => this.handleTextFieldChangeCourse(e)}
                    />
                    <button onClick={() => this.appendToCourseList()}>
                        Add Course
                    </button>
                    <button onClick={() => this.addInstituteToBlockchain()}>
                        Add institute
                    </button>
                </> : <></>}


        </>
    );
}
}

export default Admin