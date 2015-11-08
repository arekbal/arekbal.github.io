var parser = new Gherkin.Parser;
parser.stopAtFirstError = false;

var that = 
{
  namespaceName: ko.observable(""),
  inputText: ko.observable(""),
  mode: ko.observable("MsTest"),
  errorText: ko.observable(""),
  usings: ko.observableArray()
}

that.inputText.extend({ rateLimit: 400 }).subscribe(function(v) 
{
  that.errorText(parse(that.inputText()))
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
    usings.push("GherkinSpec.MsTest")
    usings.push("Microsoft.VisualStudio.TestTools.UnitTesting")
    
  that.usings(usings)
}

setMode()

ko.applyBindings(that)

function generate_code(ast)
{
  var result = JSON.stringify(ast, null, 2);
  
  var usings = 
  [
    "GherkinSpec.Core",
  ]
 
  if(mode.value == "MsTest")
    usings.push("GherkinSpec.MsTest")
    usings.push("Microsoft.VisualStudio.TestTools.UnitTesting")
        
  var usingsText = usings.reduce(function(prev, curr, index, arr) { return prev + "using " + curr + ";\n" }, "")
     
  var namespaceBeginText = "namespace @{NAMESPACE}\n" + 
    "{\n"
    
  var namespaceEndText = "}"
  
  var classAttributesText = "[Feature(FilePath=\"Hahhah\")]"
  var classBeginText = classAttributesText + "\n" + 
    "class @{CLASS_NAME}\n" + 
    "{\n"
    
  var classEndText = "}\n"

  return usingsText + namespaceBeginText +  + namespaceEndText
}

function parse(inputText) {  
  try {
    var ast = parser.parse(inputText);
    return generate_code(ast)
  } catch (e) {
    return e.message;
  }
}

var timeoutHandle = 0

input.onkeyup = function () {
  clearTimeout(timeoutHandle)
  timeoutHandle = setTimeout(parse, 250)
};

parse();