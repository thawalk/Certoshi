import React from "react";
import Institution from '../contracts/Institution.json'
import Web3 from 'web3'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import { Form, } from "react-bootstrap";
import Grid from "@material-ui/core/Grid";




import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import ChainImage from "../Images/chainT.png";
import Link from "react-router-dom/Link";

const styles = theme => ({
  paper: {
    [theme.breakpoints.up("sm")]: {
      borderRadius: "5%",
      marginRight: 30
    },
    [theme.breakpoints.up(1150)]: {
      marginLeft: 50,
      width: 500
    },
    height: "90vh",
    marginTop: theme.spacing.unit * 6,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  media: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  imgstyles: {
    maxWidth: "70vw",
    maxHeight: "90vh",
    [theme.breakpoints.down(1200)]: {
      marginTop: theme.spacing.unit * 4
    }
  }
});

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
        instituteCourses: []
    };

    async componentWillMount() {
        await this.loadWeb3Metamask()
        await this.loadBlockChainDataAndCheckAdmin()
    }

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
            console.log("caller", caller)
            const networkId = await web3.eth.net.getId()
            console.log("networkId", networkId)
            // Load institution contract
            const institutionData = Institution.networks[networkId]
            if (institutionData) {
                // create a web3 version of the contract
                const institution = new web3.eth.Contract(Institution.abi, institutionData.address)
                console.log("institution", institution)
                this.setState({ institution })
                try {
                    // get owner of smart contract
                    let smartContractOwner = await institution.methods.owner().call()
                    console.log("smartContractOwner", smartContractOwner)
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
                    console.log("error is", error)
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

    confirmPage(){
        console.log("instAdd",this.state.instituteAddress)
        console.log("name",this.state.instituteName)
        console.log("acro",this.state.instituteAcronym)
        console.log("web",this.state.instituteWebsite)
        console.log("course",this.state.instituteCourses)
        


    }

    async addInstituteToBlockchain() {
        console.log("adding institute to the blockchain")
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        let caller = accounts[0]

        //------------ mock data start-----------------//
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
        //------------ mock data end-----------------//

        // instantiate the contract (---can't maintain it in a state for some reason, need to check again later----)
        const networkId = await web3.eth.net.getId()
        const institutionData = Institution.networks[networkId]
        const institution = new web3.eth.Contract(Institution.abi, institutionData.address)
        try {
            // get owner of smart contract
            let smartContractOwner = await institution.methods.owner().call()

            // compare the caller and the owner of smart contract
            if (caller == smartContractOwner) {

                //------------ mock data start-----------------//
                // await institution.methods.addInstitute(
                //     instituteAddress,
                //     mockInstitute.instituteName,
                //     mockInstitute.instituteAcronym,
                //     mockInstitute.instituteLink,
                //     mockInstituteCourses
                // )
                //------------ mock data end-----------------//

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
        // console.log(this.state)
        // this.addToStore()

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
        const { classes } = this.props;
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
                            renderAdmin ? (<h1 align="center">Welcome, System Admin</h1>) :
                                (<h1>Not admin</h1>)

                }
                {renderAdmin ?
                    <>
                        <div>
                      <Grid container style={{ height: "100%", justifyContent: "center"}}>
                          <Paper className={classes.paper}>
                            <Typography component="h1" variant="h5">
                              Add Institute Details
                            </Typography>
                            <form className={classes.form}>
                              <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="email">Account Address</InputLabel>
                                <Input
                                  id="address"
                                  label="Institute Account Address"
                                  type="name"
                                  value={instituteAddress}
                                  onChange={(e) => this.handleTextFieldChangeAddress(e)}
                                  autoFocus
                                />
                              </FormControl>
                              <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="email">Institute Name</InputLabel>
                                <Input
                                  id="address"
                                  label="Institute Name"
                                  type="name"
                                  value={instituteName}
                                  onChange={(e) => this.handleTextFieldChangeName(e)}
                                  autoFocus
                                />
                              </FormControl>
                              <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="email">Institute Acronym</InputLabel>
                                <Input
                                  id="address"
                                  label="Institute Acronym"
                                  type="name"
                                  value={instituteAcronym}
                                  onChange={(e) => this.handleTextFieldChangeAcronym(e)}
                                  autoFocus
                                />
                              </FormControl>
                              <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="email">Institute Website</InputLabel>
                                <Input
                                  id="address"
                                  label="Institute Website"
                                  type="name"
                                  value={instituteWebsite}
                                  onChange={(e) => this.handleTextFieldChangeWebsite(e)}
                                  autoFocus
                                />
                              </FormControl>
                              <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="email">Course Name</InputLabel>
                                <Input
                                  id="address"
                                  label="Add course"
                                  type="name"
                                  value={course}
                                  onChange={(e) => this.handleTextFieldChangeCourse(e)}
                                  autoFocus
                                />
                              </FormControl>
                              <Button onClick={() => this.appendToCourseList()}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}>
                                Add Courses
                              </Button>
                              <Button component={Link} to="/instituteConfirmation" onClick={() => this.check() } 
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}>
                                CONFIRM
                              </Button>
                              <Button onClick={() => this.addInstituteToBlockchain()}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}>
                                Add Institute
                              </Button>
                            </form>
                          </Paper>
                        </Grid>
                    </div>
                    </> : <></>}


            </>
        );
    }
}

Admin.propTypes = {
    classes: PropTypes.object.isRequired
  };
  
  export default withStyles(styles)(Admin);