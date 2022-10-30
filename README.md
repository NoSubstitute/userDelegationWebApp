# userDelegationWebApp
Manage Gmail Delegates in a web app - List, Add & Remove delegates

[Copy this template](https://script.google.com/d/1VKtyhJyTBGaDZ3SAovVIUiVIM4c8SGZFlLQLDLI65gQdqQjd5frMMjem/edit) to get a copy of the Google Apps Script.

Or create your own script and copy-paste all the code into the necessary files.<br>
Then read [How to make it work](https://github.com/NoSubstitute/userDelegationWebApp/edit/main/README.md#how-to-make-it-work---yes-this-is-absolutely-necessary-to-do-first).

## Use the _userDelegation web app_ to list, add and remove delegates.

Add inbox account to _list_ delegates.<br>
Add a user in the right input field to which you wish to _Add_ or _Remove_ access to the inbox.<br>
Then press the relevant action button.<br><br>
<img width="600" alt="userDelegation-main" src="https://user-images.githubusercontent.com/12572734/198885356-5ac5604b-7e4f-419f-b039-3806ccbea7f5.png">

The result of each action will be shown on the bottom half of the page.<br><br>
<img width="598" alt="userDelegation-errors" src="https://user-images.githubusercontent.com/12572734/198885370-efc68fb1-5cb9-41e2-af9a-43c2005716b6.png">

## How to make it work - Yes, this is absolutely necessary to do first.
secrets.gs needs secrets from a service account with domain wide access to the necessary scopes.

[Read the wiki](https://github.com/NoSubstitute/userDelegationWebApp/wiki) how you set that up.

The secrets.gs in the repo will never have any secrets, as that would give any user acess to my domain. Which is why you also shouldn't post your secrets publicly, and only give access to this web app to trusted admins. Even if that's a given, it never hurts to remind people. :-)

The web app has built-in checks to restrict access to only a specified user, and when using a password in the URL.

[PRIVACY POLICY](https://tools.no-substitute.com/pp)

tl;dr - No data is sent anywhere, except between you and Google.

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.me/NoSubstitute)
