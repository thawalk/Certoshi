import React from "react";
import Institution from '../contracts/Institution.json'
import Certification from '../contracts/Certification.json'
import Web3 from 'web3'
import { v4 as uuidv4 } from 'uuid';
import TextField from '@material-ui/core/TextField';
import CryptoJS from "crypto-js";
import { encrypt } from './encrypt'


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
        instituteCourses: [],
        candidateName: "",
        selectedCourse: "",
        creationDate: 0,
        isLegitInstitute: false
    };

    async componentWillMount() {
        await this.loadWeb3Metamask()
    }

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

    async checkAddressAndGetCourses() {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        let caller = accounts[0]
        
        const networkId = await web3.eth.net.getId()
        const institutionData = Institution.networks[networkId]
        const institution = new web3.eth.Contract(Institution.abi, institutionData.address)

        try {

            await institution.methods.getInstituteData().call({from: caller}).then(res => {
                const formattedInstituteCoursesData = res[3].map((x) => {
                    return { course_name: x.course_name };
                });

                this.setState({
                    instituteName: res[0],
                    instituteAcronym: res[1],
                    instituteWebsite: res[2],
                    instituteCourses: formattedInstituteCoursesData,
                    isLegitInstitute: true
                })
            })
        }
        catch (error) {
            alert("Account address is wrong or does not exist in the smart contract")
        }


    }



    async generateCertificate() {
        console.log("generating certificate")
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        let caller = accounts[0]

        //------------ mock data start-----------------//
        let mockCert = {
            candidateName: "John Lim",
            courseName: "Computer Science and Design",
            creationDate: new Date().getTime(),
            id: "5c0157fd3ff47a2a54075b01",
            /*
                mockCert.id,
                mockCert.candidateName,
                mockCert.courseName,
                mockCert.creationDate, { from: mockInstituteAcc }
            */
        };
        //------------ mock data end-----------------//

        // instantiate the contract (---can't maintain it in a state for some reason, need to check again later----)
        const networkId = await web3.eth.net.getId()
        const certificationData = Certification.networks[networkId]
        const certification = new web3.eth.Contract(Certification.abi, certificationData.address)
        try {
            const certId = uuidv4()

            await certification.methods.generateCertificate(
                certId,
                encrypt(this.state.candidateName,certId),
                // use a dropdown menu to select course - change to this.state.courseName
                0,
                // use like a date picker and convert to utc - change to this.state.creationDate
                encrypt(mockCert.creationDate,certId)
            )
                .send({ from: caller }).on('receipt', function (receipt) {
                    console.log(certId)
                    // ----- here can use a state or smth, to display a success message -----
                })
        }
        catch (error) {
            console.log(error)
            console.log(error.code)
            if (error.code == -32603) {
                window.alert('Certificate with id already exits')
            }
            if (error.code == 4001) {
                window.alert('Transaction rejected')
            }
        }
    }

    handleTextFieldChangeCandidateName(e) {
        this.setState({
            candidateName: e.target.value
        })
    }


    render() {
        const {
            renderLoading,
            renderMetaMaskError,
            instituteName,
            instituteAcronym,
            instituteWebsite,
            instituteCourses,
            isLegitInstitute,
            candidateName
        } = this.state;
        return (
            <>
                {renderLoading ? (<h1>Loading</h1>) :
                    renderMetaMaskError ? (<h1>Metamask issue</h1>) :
                        (<h1>Welcome</h1>)}
                <button onClick={() => this.checkAddressAndGetCourses()}>
                    Get courses
                </button>
                <button onClick={() => this.check()}>
                    check
                </button>

                {/*need to pipe properly, but the data is in instituteCourses*/}
                {/* <h1>{instituteCourses}</h1> */}
                {isLegitInstitute ?
                    <>
                        <h1>instituteName</h1>
                        <h1>{instituteName}</h1>
                        <h1>instituteAcronym</h1>
                        <h1>{instituteAcronym}</h1>
                        <h1>instituteWebsite</h1>
                        <h1>{instituteWebsite}</h1>
                        <TextField
                            // add a error function to ensure they don't submit empty strings
                            // error={error}
                            autoFocus
                            margin="dense"
                            id="name"
                            label="CandidateName"
                            type="name"
                            fullWidth
                            value={candidateName}
                            // helperText={helperText}
                            onChange={(e) => this.handleTextFieldChangeCandidateName(e)}
                        />
                        <h1>Add a expiration date picker here and connect with creationDate state</h1>
                        <h1>Add a course picker here and connect with selectedCourse state</h1>
                        <button onClick={() => this.generateCertificate()}>
                            Generate Cert
                        </button>
                    </> :
                    <></>}

            </>
        );
    }
}

export default GenerateCert
