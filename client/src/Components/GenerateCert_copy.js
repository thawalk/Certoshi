import React from "react";
import Institution from '../contracts/Institution.json'
import Certification from '../contracts/Certification.json'
import Web3 from 'web3'
import { v4 as uuidv4 } from 'uuid';

import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
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
        isLegitInstitute: false
    };
    // this.delta = this.delta.bind(this);

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
        console.log("adding institute to the blockchain")
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        let caller = accounts[0]

        const networkId = await web3.eth.net.getId()
        const institutionData = Institution.networks[networkId]
        const institution = new web3.eth.Contract(Institution.abi, institutionData.address)

        // let instituteAddress = "0x83E41c66E7EE0f14d0Fc8E74720652F6662eB1Eb"

        // to be changed to not having address
        // copy over the institute address that you added

        let instituteAddress = "0x027AC1820dE72D6f7B0a5d306081Bc529056B871"
        console.log("caller", caller)

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



    async generateCertificate() {
        console.log("generating certificate")
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        let caller = accounts[0]

        console.log(caller)

        //------------ mock data start-----------------//
        let mockCert = {
            candidateName: "John Lim",
            courseName: "Computer Science and Design",
            //---------------- remember to convert to utc time -------------------//
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


            const id = uuidv4()
            await certification.methods.generateCertificate(
                id,
                this.state.candidateName,
                // use a dropdown menu to select course - change to this.state.courseName
                mockCert.courseName,
                // use like a date picker and convert to utc - change to this.state.expirationDate
                mockCert.creationDate,
            )
                .send({ from: caller }).on('receipt', function (receipt) {
                    console.log(receipt);
                    console.log("uuid", id)
                    console.log(receipt.events)
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

    check() {
        console.log(this.state.instituteCourses)
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
            candidateName, //AFTER THIS LINE CHANGE
            firstname, //NINA STATES ONWARDS
            lastname,
            organization,
            coursename,
            duration,
            currentState,
            orgLogo,
            emailId,
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
                        <Grid container align="center" justify="center" alignItems="center">
                            <Grid item xs={8} sm={8}>
                                <Paper className={classes.paper}>
                                    <Typography variant="h3" color="inherit">
                                        Certificate Generation Form
                                    </Typography>
                                    <form
                                        className={classes.container}
                                        autoComplete="off"
                                        onSubmit={this.submitData}
                                    >
                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                required
                                                id="institute-name"
                                                label="Institute Name"
                                                className={classes.instituteField}
                                                defaultValue={organization}
                                                margin="normal"
                                                variant="outlined"
                                                InputProps={{
                                                    readOnly: true
                                                }}
                                            />
                                            <TextField
                                                required
                                                id="institute-acronym"
                                                label="Institute Acronym"
                                                className={classes.instituteField}
                                                defaultValue={organization}
                                                margin="normal"
                                                variant="outlined"
                                                InputProps={{
                                                    readOnly: true
                                                }}
                                            />
                                            <TextField
                                                required
                                                id="institute-website"
                                                label="Institute Website"
                                                className={classes.instituteField}
                                                defaultValue={organization}
                                                margin="normal"
                                                variant="outlined"
                                                InputProps={{
                                                    readOnly: true
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                required
                                                id="firstname"
                                                label="First Name"
                                                className={classes.textField}
                                                value={firstname}
                                                onChange={this.handleChange("firstname")}
                                                margin="normal"
                                                variant="outlined"
                                            />
                                            <TextField
                                                required
                                                id="lastname"
                                                label="Last Name"
                                                className={classes.textField}
                                                value={lastname}
                                                onChange={this.handleChange("lastname")}
                                                margin="normal"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} >
                                            <FormControl required variant="outlined" className={classes.formControl}>
                                                <InputLabel htmlFor="course-name">Course Name</InputLabel>
                                                <Select
                                                    native
                                                    value={this.state.course}
                                                    onChange={this.handleChange("coursename")}
                                                    label="Age"
                                                    inputProps={{
                                                        course: '',
                                                        id: 'course-name'
                                                    }}
                                                >
                                                    <option aria-label="None" value="" />
                                                    <option value={10}>Course 1</option>
                                                    <option value={20}>Course 2</option>
                                                    <option value={30}>Course 3</option>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <SubmitAnimation
                                                currentState={currentState}
                                                className={classes.submitBtn}
                                            />
                                            {currentState === "validate" && (
                                                <Typography
                                                    variant="caption"
                                                    color="inherit"
                                                    className={classes.submitBtn}
                                                >
                                                    Certificate genrated with id {certificateId}
                                                </Typography>
                                            )}
                                        </Grid>
                                    </form>
                                </Paper>
                            </Grid>
                        </Grid>


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
                        <h1>Add a expiration date picker here and connect with expirationDate state</h1>
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
GenerateCert.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GenerateCert);
