import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';

// Internal Components
import Certificate from "./Certificate";
import VerifyBadge from "./VerifyBadge";
import Loader from "./Loader";

// Material UI Components
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

// Smart Contract essentials
import Web3 from 'web3'
import HDWalletProvider from "truffle-hdwallet-provider"
import contract from "truffle-contract";
import Certification from '../contracts/Certification.json'
const CertificationInstance = contract(Certification);


const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "91.5vh"
  },
  paper: {
    [theme.breakpoints.down("sm")]: {
      padding: `${theme.spacing.unit * 2}px`,
      margin: theme.spacing.unit * 2
    },
    minHeight: "75vh",
    maxWidth: "95%",
    margin: theme.spacing.unit * 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
  textitems: {
    margin: "20px 10px",
    textAlign: "center"
  }
  
}));

function CertificateDisplay(){
    const certTemplate = {
      candidateName: "",
      courseName: "",
      creationDate: null,
      expirationDate: null,
      instituteName: "",
      instituteAcronym: "",
      instituteLink: "",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/FOSSASIA_Logo.svg/600px-FOSSASIA_Logo.svg.png"
    }
    const [certData, setCertData] = useState(certTemplate)
    const [loading, setLoading] = useState(true)
    const [verified, setVerified] = useState(null)
    let { id } = useParams();
    const classes = useStyles();


    let web3
    const connectWeb3 = () => {
        if (process.env.NODE_ENV === "development" && process.env.REACT_APP_STAGE !== "testnet") {
            web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_LOCAL_ENDPOINT));
        } else {
            web3 = new Web3(new HDWalletProvider(process.env.REACT_APP_MNEMONIC, process.env.REACT_APP_INFURA_PROJECT_ENDPOINT));
        }
        CertificationInstance.setProvider(web3.currentProvider);
        // hack for web3@1.0.0 support for localhost testrpc, see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
        if (typeof CertificationInstance.currentProvider.sendAsync !== "function") {
            CertificationInstance.currentProvider.sendAsync = function() {
                return CertificationInstance.currentProvider.send.apply(CertificationInstance.currentProvider,arguments);
            };
        }

        if (process.env.NODE_ENV === "development" && process.env.REACT_APP_STAGE !== "testnet") {
            console.log("Current host: " + web3.currentProvider.host)
        }else{
            console.log("Current host: " + web3.currentProvider.engine._providers[2].provider.host);
        }
    };

    const getCertificateData = (certificateId) => {
        CertificationInstance.setProvider(web3.currentProvider);
        return CertificationInstance.deployed()
        .then(ins => ins.getData(certificateId))
        .catch(err => Promise.reject("No certificate found with the input id"));
    };

    useEffect(async () =>{
        console.log(process.env.REACT_APP_STAGE)
        console.log(process.env.NODE_ENV)
        console.log(process.env.REACT_APP_INFURA_PROJECT_ENDPOINT)
        console.log(process.env.REACT_APP_MNEMONIC)
        connectWeb3()
        getCertificateData(id).then((data)=>{
            console.log("Here's the retrieved certificate data of id", id)    
            console.log(data)            
            setCertData((prev)=>({...prev,
                candidateName: data[0],
                courseName: data[1],
                creationDate: null,
                expirationDate: data[2]['c'][0], // note that this is a integer e.g. 1628627980432
                instituteName: data[3],
                instituteAcronym: data[4],
                instituteLink: data[5]
            }))
            setVerified(true)
            setLoading(false)
        }).catch((err)=>{
            console.log("Certificate of id", id, "does not exist")
            setVerified(false)
            setLoading(false)
        })
        
    },[])
    return(
        <>
         <Grid container className={classes.root}>
        <Grid item xs={12} sm={8}>
            {
                loading && (<Loader SIZE={170} />)
            }
            {
                !loading && !verified && (
                    <p>This certificate id {id} does not exist!</p>
                )
            }
            {
                !loading && verified && (
                    <>
                    {/* You can render the certificate details in this Certificate component */}
                   {/* <Certificate
                        name={certData.candidateName}
                        title={certData.courseName}
                        creationDate={certData.creationDate}
                        expirationDate={certData.expirationDate}
                        hash={id}
                        logo={certData.logo}/> */}
                    <Paper className={classes.paper}>
                        <p>Congrats, this cert exists and is verified!</p>
                        <p>Below are the cert details:</p>
                        <p>cert id: {id}</p>
                        <p>{certData.candidateName}</p>
                        <p>{certData.courseName}</p>
                        <p>{certData.expirationDate}</p>
                        <p>{certData.instituteName}</p>
                        <p>{certData.instituteAcronym}</p>
                        <p>{certData.instituteLink}</p>
                    </Paper>
                    </>
                )
            } 
        </Grid>
        {!loading && verified && (
            <Grid item xs={12} sm={4}>
                <Paper className={classes.rightpaper}>
                <Grid container className={classes.verificationBox}>
                    <Grid item sm={12}>
                        <VerifyBadge />
                            <Typography
                            variant="subtitle1"
                            className={classes.textitems}
                            >
                            This certificate is Blockchain Verified
                            </Typography>
                    </Grid>
                </Grid>
                </Paper>
            </Grid>
        )}
        
      </Grid>
        </>
    )
}

export default CertificateDisplay;
