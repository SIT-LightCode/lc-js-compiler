import { VM } from "vm2";

export default function compileJS(code: string, paramsArray: any[]) {
  let results: {
    isError: boolean;
    errorMessage: string | null;
    result: any;
  }[] = [];

  try {
    const vm = new VM({
      timeout: 2000,
      sandbox: {},
    });

    vm.run(code);

    paramsArray.forEach((params) => {
      try {
        const result = vm.run(`answer(...${JSON.stringify(params)})`);

        results.push({
          isError: false,
          errorMessage: null,
          result: result === undefined ? "undefined" : result,
        });
      } catch (error) {
        results.push({
          isError: true,
          errorMessage:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          result: null,
        });
      }
    });

    return results;
  } catch (error) {
    // handle global errors
    return {
      isError: true,
      errorMessage: "A global error occurred while compiling the JS code",
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
