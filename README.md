# Hey Office Alexa Skill

## Resources

https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs

https://github.com/amzn/alexa-skills-kit-js


## Generate Utterances

`flutterance config/flutterance.txt config/utterances.txt`


## To Edit/Update Utterances/Intent
  - Add the utterances locally: `config/utterances.txt`
  - Go to [`developer.amazon.com`](http://developer.amazon.com/) and login to SmartMirror's Account
    * Go to `APPS & SERVICES` > `Alexa` > `Alexa Skills Kit`
    * Choose the skills to Edit
    * Click `Interaction Model`
    * Copy and paste the content in `config/utterances.txt` into the `Sample Utterances` section and `Save`
  - Copy and paste the Intents into the `Intent Schema` section and `Save`
  - Intent updated and ready to utter.
