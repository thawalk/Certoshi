import React from "react";
import Institution from '../contracts/Institution.json'
import Certification from '../contracts/Certification.json'
import Web3 from 'web3'
import { v4 as uuidv4 } from 'uuid';


class GenerateCert extends React.Component {
    state = {
        owner: '0x0',
        isOwner: false,
        institute: {},
        renderLoading: true,
        renderMetaMaskError: false,
        instituteName: "",
        instituteAcronym: "",
        instituteWebsite: "",
        instituteCourses: []
    };
    // this.delta = this.delta.bind(this);

    async componentWillMount() {
        await this.loadWeb3Metamask()
    }

    // way to connect first way
    async loadWeb3Metamask() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable().then(res => {
                this.setState({
                renderLoading: false,
                renderMetaMaskError: false
            })
            })
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
            this.setState({
                renderLoading: false,
                renderMetaMaskError: false
            })
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
            this.setState({
                renderLoading: false,
                renderMetaMaskError: true
            })
        }
    }

    async checkTokenAndGetCourses() {
        console.log("adding institute to the blockchain")
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        let caller = accounts[0]

        const networkId = await web3.eth.net.getId()
        const institutionData = Institution.networks[networkId]
        const institution = new web3.eth.Contract(Institution.abi, institutionData.address)

        // let instituteAddress = "0x83E41c66E7EE0f14d0Fc8E74720652F6662eB1Eb"

        let instituteAddress = "0x2C7475d55Fa3e0F239e244846CCe297fdeB3D0F3"
        try{
            
            await institution.methods.getInstituteData(instituteAddress).call().then(res => {
                const formattedInstituteCoursesData = res[3].map((x) => {
                    return { course_name: x.course_name };
                });
    
                this.setState({
                    instituteName: res[0],
                    instituteAcronym: res[1],
                    instituteWebsite: res[2],
                    instituteCourses: formattedInstituteCoursesData
                })
            })
        }
        catch (error) {
            alert("Account address is wrong or does not exist in the smart contract")
        }


    } 

    async generateCertificate() {
        console.log("adding institute to the blockchain")
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        let caller = accounts[0]

        //------------ mock data -----------------//
        let mockCert = {
            candidateName: "John Lim",
            orgName: "Singapore University of Technology and Design",
            courseName: "Computer Science and Design",
            expirationDate: new Date().getTime(),
            id: "5c0157fd3ff47a2a54075b01",
        };
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
                        //-------clearing the value, doesn't work also----------//
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
            if (error.code == 4001) {
                window.alert('Transaction rejected')
            }
        }
    }




    render() {
        const {
            renderLoading,
            renderMetaMaskError,
            instituteName,
            instituteAcronym,
            instituteWebsite,
            instituteCourses
        } = this.state;
        return (
            <>
                {renderLoading ? (<h1>Loading</h1>) :
                    renderMetaMaskError ? (<h1>Metamask issue</h1>) :
                            (<h1>Welcome</h1>)}
                <button onClick={() => this.checkTokenAndGetCourses()}>
                    Get courses
                </button>
                <h1>{instituteName}</h1>
                <h1>{instituteAcronym}</h1>
                <h1>{instituteWebsite}</h1>
                {/*need to pipe properly, but the data is in instituteCourses*/}
                {/* <h1>{instituteCourses}</h1> */}
                <button onClick={() => this.generateCertificate()}>
                    Generate Cert
                </button>
            </>
        );
    }
}

export default GenerateCert
