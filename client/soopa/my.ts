module my
{
	export class Anulus
	{
		@doc('hellotrue', 'debede')
		goTo()
		{
			console.log('goTo')
		}
		
		constructor(public hahah:string)
		{ 
			var arr = ['a', 'b', 'c']
			for(var i of arr)
				console.log(i)
		}
	}
}

function doc(b:string, c:string)
{
	return (target:any, name:string, descriptor:any) => {
	
	  descriptor.enumerable = false;
	  return descriptor;
	}
}

