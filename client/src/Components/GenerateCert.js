import React from "react";
import Institution from '../contracts/Institution.json'
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
            console.log("passing")
            await window.ethereum.enable().then(res => {
                this.setState({
                renderLoading: false,
                renderMetaMaskError: false
            })
            })
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
            console.log("passing as well")
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

        let mockToken = '0f747a16-7c3a-4c98-9e1a-c4519cdb0682'

        await institution.methods.getInstituteData(mockToken).call().then(res => {
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
            </>
        );
    }
}

export default GenerateCert
