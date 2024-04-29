import { log } from "console";
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
    console.log(paramsArray); // [ { '1': [ 1, 3, 4 ], '2': 7 }, { '1': [ 1, 6, 4 ], '2': 10 } ]

    // paramsArray.forEach((params) => {
    //   // Convert object values to an array
    //   const parameters = Object.values(params)
    //     .map((param) => {
    //       if (Array.isArray(param)) {
    //         return `[${param.join(", ")}]`;
    //       } else {
    //         return `'${param}'`;
    //       }
    //     })
    //     .join(", ");

    function formatParameter(param: any) {
      console.log("infunc");
      console.log(param);
      if (Array.isArray(param)) {
        console.log("hereeee");

        return param;
      }
      if (typeof param === "string") {
        try {
          const parsed = JSON.parse(param);
          if (typeof parsed === "object") {
            return param; // do nothing
          }
        } catch (e) {
          // If parsing fails, it's a pure string
          return `'${param}'`;
        }
      }
      return param;
    }
    //   console.log(parameters); // [ { '1': { key: 123 } } ]
    paramsArray.forEach((params) => {
      // Convert object values to an array
      console.log(params); // { '1': { key: 123 } }

      const formatParameters = (params: any) => {
        return Object.values(params)
          .map((param) => {
            if (typeof param === "object" || Array.isArray(param)) {
              // This will correctly serialize both objects and arrays
              return JSON.stringify(param);
            } else if (typeof param === "string") {
              // Ensures that strings are properly quoted
              return `'${param}'`;
            } else {
              // Numbers and other types are returned as is
              return param;
            }
          })
          .join(", ");
      };

      try {
        const formattedParams = formatParameters(params);
        const result = vm.run(`answer(${formattedParams})`);

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
