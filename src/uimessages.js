//Reusable strings that will be used in UI Messages like alerts, error handling etc. 
//kept here to avoid polluting global scope inside Functional Components

// Job Creator

const messages = {
    universal : {
        incomplete : "Please Complete Required Fields"
    },
    kvidAlerts : {
    infoStr : "Welcome to the work order creator. Only you will see the completed form, and your client will only have access to the job name and price when they checkout.",
    successStr : "Success! Job created. You can view and edit the work order with all other active jobs in the Job Viewer.",
    errorStr : "Hm, something went wrong. Let's try that again."
    }
}

export default messages