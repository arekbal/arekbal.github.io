var input = document.getElementById('input');
var output = document.getElementById('output');
var mode = document.getElementById('mode');
var ns = document.getElementById('ns');
var parser = new Gherkin.Parser();

parser.stopAtFirstError = false;

var template =
"@foreach"

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

function parse() {
  var result;
  try {
    var ast = parser.parse(input.value);
    result = generate_code(ast)
  } catch (e) {
    result = e.stack;
  }
  output.innerHTML = result;
}

var timeoutHandle = 0

input.onkeyup = function () {
  clearTimeout(timeoutHandle)
  timeoutHandle = setTimeout(parse, 250)
};

parse();