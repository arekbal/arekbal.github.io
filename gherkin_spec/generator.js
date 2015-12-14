var parser = new Gherkin.Parser;
parser.stopAtFirstError = false;

ko.punches.enableAll();

var that = 
{
  filePath: ko.observable(""),
  fileAddress: ko.observable(""),
  loader: ko.observable(""),
  loaderParam: ko.observable(""),
  loaderText: ko.pureComputed(function(){
    if(that.filePath())
      return "FilePath=\"" + that.filePath() + "\""
      
     if(that.fileAddress())
      return "FileAddress=\"" + that.fileAddress() + "\""
      
    if(that.loader())
    {
      if(that.loaderParam())
        return "Loader=typeof(" + that.loader() + "), LoaderParam=\"" + that.loaderParam() + "\""
      else
        return "Loader=typeof(" + that.loader() + ")"
    }
      
    return "FilePath=\"\""      
  }),
  namespaceName: ko.observable("NAMESPACE"),
  inputText: ko.observable(""),
  mode: ko.observable("MsTest"),
  modes: ko.observableArray(["Base", "MsTest"/*, "NUnit", "xUnit"*/]),
  errorText: ko.observable(""),
  ast: ko.observable(),
  usings: ko.observableArray(),
  useSeparateScenarioNames : ko.observable(false),
  baseClass: ko.observable("GherkinSpecBase"),
  useKeywords: ko.observable(true),
  knownKeywords: ko.observable("Given, And, But, When, Then"),
  knownKeywordsArray : ko.pureComputed(function(){ return that.knownKeywords().split(' ').join('').split(',') }),
  allScenariosCoveredTest : ko.observable(true),
  loadExample: function()
  {
    that.inputText(exampleFeature);
  },  
  copyToCliboard: function()
  {
    var copyPre = document.querySelector('.js-copy-pre');    
    var copyPreTarget = document.querySelector('.js-copy-pre-target');
    copyPreTarget.value = copyPre.textContent;
    
    copyPreTarget.style.display = "block"
    
     copyPreTarget.style.position = 'fixed';
  copyPreTarget.style.top = 0;
  copyPreTarget.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  copyPreTarget.style.width = '2em';
  copyPreTarget.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  copyPreTarget.style.padding = 0;

  // Clean up any borders.
  copyPreTarget.style.border = 'none';
  copyPreTarget.style.outline = 'none';
  copyPreTarget.style.boxShadow = 'none';
    
    copyPreTarget.select();  
  
    try {
      if(!document.execCommand('copy'))
      alert('Oops, unable to copy');
    } catch (err) {
      alert('Oops, unable to copy:' + err.message);
    }
    
    copyPreTarget.style.display = "none"
  }
}

that.inputText.extend({ rateLimit: 400 }).subscribe(function(v) 
{
  parse(that.inputText())
})

that.mode.subscribe(function(v)
{
  setMode()
})

function setMode()
{
  var usings = 
  [
    "GherkinSpec.Core",
  ]
 
  if(that.mode() == "MsTest")
  {
    usings.push("GherkinSpec.MsTest")
    usings.push("Microsoft.VisualStudio.TestTools.UnitTesting")
  }
    
  that.usings(usings)
}

setMode()

ko.applyBindings(that)

function parse(inputText) 
{
  that.ast(null)
  that.errorText("")
  if(!inputText || inputText.trim() == "")
	  return
  
  try {
    that.ast(parser.parse(inputText));
  } catch (e) {
    that.errorText(e.message);
  }
}

parse();

var exampleFeature = (function () {/*
@hicking
Feature: Serve coffee
    Coffee should not be served until paid for
    Coffee should not be served until the button has been pressed
    If there is no coffee left then money should be refunded

  Background:
    Given a global administrator named 'Greg'
    And a blog named Greg's anti-tax rants
    And a customer named 'Wilson'
    And a blog named 'Expensive Therapy' owned by 'Wilson'

  @billing @bicker @annoy
  Scenario: Buy last coffee
    Given a blog post named "Random" with:
    """
    Some Title, Eh?
    ===============
    Here is the first paragraph of my blog post.
    Lorem ipsum dolor sit amet, consectetur adipiscing
    elit.
    """
    Given there are 1 coffees left in the machine
    And I have deposited 1$
	Given the following people exist:
      | name  | email           | phone |
      | Aslak | aslak@email.com | 123   |
      | Joe   | joe@email.com   | 234   |
      | Bryan | bryan@email.org | 456   |
    When I press the coffee button
    Then I should be served a coffee
	Then the greeting service response will contain one of the following messages:
      |Hello how are you doing?|
      |Welcome to the front door!|
      |How has your day been?|
      |Come right on in!|

  Scenario: Buy last coffee 2
    Given there are 1 coffees left in the machine
    And I have deposited 1$
	Given the following people exist:
      | name  | email           | phone |
      | Aslak | aslak@email.com | 123   |
      | Joe   | joe@email.com   | 234   |
      | Bryan | bryan@email.org | 456   |
    When I press the coffee button
    Then I should be served a coffee
	Then the greeting service response will contain one of the following messages:
      |Hello how are you doing?|
      |Welcome to the front door!|
      |How has your day been?|
      |Come right on in!|

  Scenario Outline: Eating
    Given there are <start> cucumbers
    When I eat <eat> cucumbers
    Then I should have <left> cucumbers

	Examples: First One
	  | start | eat | left |
	  |  12   |  5  |  7   |
	  |  20   |  5  |  15  |
	Examples: Duda 1
	  | start | eat | left |
	  |  12   |  5  |  7   |
	  |  20   |  5  |  15  |
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];