import React from "react";
import Institution from '../contracts/Institution.json'
import Certification from '../contracts/Certification.json'
import Web3 from 'web3'
import { v4 as uuidv4 } from 'uuid';
import TextField from '@material-ui/core/TextField';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import SubmitAnimation from "./SubmitAnimation";
import { generateCertificate } from "../Utils/apiConnect";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import FormHelperText from '@material-ui/core/FormHelperText';
import CryptoJS from "crypto-js";
import { encrypt } from './encrypt'
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
    container: {
        display: "flex",
        flexWrap: "wrap"
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 520,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        [theme.breakpoints.up("sm")]: { width: 250 },
        [theme.breakpoints.down("sm")]: { width: 200 }
    },
    instituteField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        [theme.breakpoints.up("sm")]: { width: 520 },
        [theme.breakpoints.down("sm")]: { width: 200 }
    },
    dense: {
        marginTop: 16
    },
    menu: {
        width: 200
    },
    paper: {
        [theme.breakpoints.down("sm")]: {
            margin: theme.spacing.unit,
            padding: `${theme.spacing.unit * 2}px`
        },
        minHeight: "75vh",
        maxWidth: "95%",
        margin: theme.spacing.unit * 5,
        display: "flex",
        flexDirection: "column",
        padding: `${theme.spacing.unit * 4}px ${theme.spacing.unit * 8}px ${theme
            .spacing.unit * 3}px`
    },
    rightpaper: {
        [theme.breakpoints.up("sm")]: {
            maxHeight: "75vh"
        },
        [theme.breakpoints.down("sm")]: {
            maxWidth: "95%",
            margin: theme.spacing.unit * 2
        },
        maxWidth: "60%",
        minWidth: "60%",
        margin: theme.spacing.unit * 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
            .spacing.unit * 3}px`
    },
    verificationBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyItems: "center",
        height: "100%",
        marginTop: theme.spacing.unit * 3
    },
    courseField: {
        [theme.breakpoints.up("sm")]: {
            width: "60%"
        },
        [theme.breakpoints.down("sm")]: {
            minWidth: "80vw"
        }
    },
    submitBtn: {
        marginLeft: "50px"
    }
});





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
        expirationDate: 0,
        isLegitInstitute: false,
        currentState: "normal", //addons
        certificateId: "",
        creationDate: 0,

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

            await institution.methods.getInstituteData().call({ from: caller }).then(res => {
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

    test() {
        console.log("test")
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
                encrypt(this.state.candidateName, certId),
                // use a dropdown menu to select course - change to this.state.courseName
                0,
                // use like a date picker and convert to utc - change to this.state.creationDate
                encrypt(mockCert.creationDate, certId)
            )
                .send({ from: caller }).on('receipt', function (receipt, test) {
                    try {

                        console.log(this.test())
                    }
                    catch (error) {
                        console.log(error)
                    }
                    console.log(certId)
                    // ----- here can use a state or smth, to display a success message -----
                })
                .then((res) => { })
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
        const { classes } = this.props;
        const {
            renderLoading,
            renderMetaMaskError,
            instituteName,
            instituteAcronym,
            instituteWebsite,
            instituteCourses,
            isLegitInstitute,
            candidateName,
            firstname,
            lastname,
            certificateId
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
                {isLegitInstitute ?
                    <>
                        <Grid container style={{ height: "100%", justifyContent: "center" }}>
                            <Paper className={classes.paper}>
                                <Typography component="h1" variant="h5">
                                    Uni Name Here
                                </Typography>
                            </Paper>
                        </Grid>
                    </> : <></>
                }

            </>
        );
    }
}

export default withStyles(styles)(GenerateCert);
