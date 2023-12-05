import { VM } from "vm2";

export default function compileJS(code: string, params: any) {
  try {
    // Create a new VM instance with a sandbox
    const vm = new VM({
      timeout: 2000, // Set a timeout to prevent infinite loops
      sandbox: {}, // Define a sandbox object if you want to provide specific globals
    });

    // Run the user's code in the VM to define the 'answer' function
    vm.run(code);

    // Call the 'answer' function from within the VM
    const result = vm.run(`answer(...${JSON.stringify(params)})`);

    return {
      isError: false,
      errorMessage: null,
      result: result,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        isError: true,
        errorMessage: error.message,
        result: null,
      };
    }
    return {
      isError: true,
      errorMessage: "An unexpected error occurred",
      result: null,
    };
  }
}

//   // Create a new function from the code string and parameters
//   console.log("test");
//   console.log();

//   const func = new Function(...Object.keys(params), code);
//   console.log("func");
//   console.log(func);

//   // Execute the function with the provided parameters
//   const result = func(...Object.values(params));
//   console.log("result");
//   console.log(result);

//   // Return the result
//   return result;
