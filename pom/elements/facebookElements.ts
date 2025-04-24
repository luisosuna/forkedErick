export class FacebookElements {

  //Define locators that should return SINGLE element
  ButtonCreateNewAccount : string = "[data-testid='open-registration-form-button']";
  InputFirstName = "[name='firstname']";
  InputLastName = "[name='lastname']";
  DDLDay = "#day";
  DDLMonth = "#month";
  DDLYear = "#year";
  RadioButtonFemale = "[id='sex'][value='1']";
  RadioButtonMale = "[id='sex'][value='2']";
  RadioButtonCustom = "[id='sex'][value='-1']";
  InputEmailOrPhone = "[name='reg_email__']";
  InputPassword = "#password_step_input";
  ButtonSignUp = "[name='websubmit']";

  //Define locators that should return LIST of elements
  DDLOptionsDay = "#day option"; //ToDo : Remove. Not necessary in PlayWright

  //Dummy
  DummySuccessMessage = '#dummy-success';
}