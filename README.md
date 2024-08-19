# Reference FNB Recon Backend

This repository contains code that implements Azure Functions to provide an API for Robots that require integration with Azure services. It offers a secure pathway to all the Cloud services necessary and provides a single place for Robots to use API's to satisfy their requirements.

The choice of Azure Functions as serverless backend provides a cost benefit in that the backend application is not running up any charges when it is not running. The backend starts running only when required to serve a running Robot. This reference project offers examples of creating the required backend API's that drive the robots or other applications.

## Technologies  
  
* Azure App Services
* Azure Functions
* Azure Key Vault
* Azure Storage
* Azure Postgres Database
* Typescript

Example of Robots consuming this reference backend: https://github.com/iqlab-africa/recon-base-robot  

### Screenshot from Development execution  

<img width="816" alt="Screenshot 2024-08-19 at 02 35 19" src="https://github.com/user-attachments/assets/124c7461-6ab1-4e4f-8fd8-17b7ff05a0b9">  

### Screenshot from Functions deployment  

<img width="880" alt="Screenshot 2024-08-19 at 02 38 24" src="https://github.com/user-attachments/assets/c3dc6218-631f-4782-91dc-d6e3e4859814">  

Assuming that you have cloned the repo, pay some attention to some helpful scripts with .sh extensions. They may help yo work with GitHub via SSH and the run.sh bootstraps the app on your machine. Check out https://github.com/iqlab-africa/recon-base-functions/blob/main/run.sh
