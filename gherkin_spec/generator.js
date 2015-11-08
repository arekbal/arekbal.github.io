var parser = new Gherkin.Parser;
parser.stopAtFirstError = false;

ko.punches.enableAll();

var that = 
{
  filePath: ko.observable("FILE_PATH"),
  namespaceName: ko.observable("NAMESPACE"),
  inputText: ko.observable(""),
  mode: ko.observable("MsTest"),
  modes: ko.observableArray(["MsTest"/*, "NUnit", "xUnit"*/]),
  errorText: ko.observable(""),
  ast: ko.observable(),
  usings: ko.observableArray(),
  useSeparateScenarioNames : ko.observable(false),
  baseClass: ko.observable("GherkinSpecBase"),
  useKeywords: ko.observable(true),
  knownKeywords: ko.observable("Given, And, But, When, Then"),
  knownKeywordsArray : ko.pureComputed(function(){ return that.knownKeywords().split(' ').join('').split(',') }),
  allScenariosCoveredTest : ko.observable(true)
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
  
  try {
    that.ast(parser.parse(inputText));
  } catch (e) {
    that.errorText(e.message);
  }
}

parse();