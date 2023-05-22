


import React, { useState } from 'react';
import { Button, Container, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Input from '@material-ui/core/Input';




const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    display: 'none',
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));



function decryptFile(file, key) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = (event) => {
      const fileData = new Uint8Array(event.target.result);
      const decryptedData = new Uint8Array(fileData.length);

      for (let i = 0; i < fileData.length; i++) {
        decryptedData[i] = fileData[i] ^ key.charCodeAt(i % key.length);
      }

      const decryptedFile = new Blob([decryptedData], { type: file.type });
      resolve(decryptedFile);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
}



function App2() {
  const classes = useStyles();
  const [file, setFile] = useState(null);
  const [decryptedFile, setDecryptedFile] = useState(null);
  const [key, setKey] = useState();
  const [hidden, setHidden] = useState(false);


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setDecryptedFile(null);
  };

  const handleClickShowPassword=()=>{
    setHidden(!hidden)
  }
  const handleUpload = async () => {
    if(key){
    try {
      const decryptedFile = await decryptFile(file, 'abcde12345');
      setDecryptedFile(decryptedFile);
    } catch (error) {
      console.error(error);
    }
     }
    else{
      alert("Key should not be empty")
    }
  };

  const handleDownload = () => {
    const downloadLink = URL.createObjectURL(decryptedFile);
    const a = document.createElement('a');
    a.href = downloadLink;
    a.download = `decrypted-${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadLink);
  };

  return (
    <Container maxWidth="sm" className={classes.container}>
      <TextField label="File name" disabled value={file ? file.name : ''} />
      <input
        accept=".pdf,.doc,.docx"
        className={classes.input}
        id="contained-button-file"
        multiple={false}
        type="file"
        onChange={handleFileChange}
      />

<br/>
    <Input  onChange={(e)=>{setKey(e.target.value)}} value={key} 
    type={hidden ? 'text' : 'password'}
    endAdornment={
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={handleClickShowPassword}

        >
          {hidden ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment>
    }
    />
      



      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          component="span"
        >
          Upload
        </Button>
      </label>
      <Button
        variant="outlined"
        color="primary"
        className={classes.button}
        onClick={handleUpload}
        disabled={!file}
      >
        decrypt
      </Button>
      {decryptedFile && (
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={handleDownload}
        >
          Download decrypted File
        </Button>
      )}
    </Container>
  );
}

export default App2;
