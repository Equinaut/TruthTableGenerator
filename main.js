function evaluate(statement, values) { //Function that will evaluate a given statement with the values of each variable you supply
    console.log(statement);

    statement = statement.replace(/\s+/g, ''); //Remove spaces
    if (statement.includes(")") || statement.includes("(")) { //Check if statement contains brackets (so needs to be broken down further)
        let lastOpenBracket = -1; //Last index of a open bracket [(]
        for (let i=0; i<statement.length; i++) { 
            char = statement[i];
            if (char=="(") lastOpenBracket = i; //Update last open bracket index
            if (char==")") { //Last open bracket to this is the depest level set of brackets
                let value = evaluate(statement.substring(lastOpenBracket + 1, i), values); //Evaluate the contents of the bracket
                if (value==0 || value==1) {
                    statement = statement.slice(0, lastOpenBracket)+value.toString()+statement.slice(i+1, statement.length);

                    if (statement.length==1) { //A single letter or literal so the statement has been solved
                        return statement;
                    }
                    else {
                        let value = evaluate(statement, values); //Otherwise evaluate the remaining statement (recursion)
                        return value;
                    }

                } else { //Bracket wasnt evaluated properly
                    console.error("Failed to solve");
                    return;
                }
            }
        }
    } else {
        if (statement.length == 2) {
            if (statement[0]=="¬") {
                let operand = statement[1];
                let value = undefined;
                if (operand=="1" || operand=="0") value = {0: true, 1: false}[operand];
                else value = !Boolean(values[operand]);
                return +value;
            } else {
                console.error("Cant solve %s", statement);
                return -1;
            }
        } else if (statement.length == 3) {
            let firstOperand = statement.slice(0,1);
            let secondOperand = statement.slice(2,3);
            let operator = statement.slice(1,2);
            
            let firstValue = undefined;
            let secondValue = undefined;

            if (firstOperand=="1" || firstOperand=="0") firstValue = {0: false, 1: true}[firstOperand];
            else firstValue = Boolean(values[firstOperand]);

            if (secondOperand=="1" || secondOperand=="0") secondValue = {0: false, 1: true}[secondOperand];
            else secondValue = Boolean(values[secondOperand]);

            switch (operator) {
                case "v": 
                    return +(firstValue || secondValue);

                case "^": 
                    return +(firstValue && secondValue);

                case "⇒": 
                    if (firstValue && !secondValue) return +false;
                    return +true;
                
                case "⇔": 
                    return +(firstValue==secondValue);
                    
                default: 
                    return +false;
            }
        } else {
            console.error("Can't evaluate %s", statement);
            return -1;
        }
    }
}


function generateTruthTable(statement) { //Generates the truth table for the supplied statement
    let args = statement.replace(/[^A-Z]/g, '');

    let table = [];

    args = new Set(args);
    args = Array.from(args).join("");

    let argIndexes = {};
    let i = 0;
    for (let arg of args) {
        argIndexes[arg] = i++;
    }
    
    for (let i=0; i<Math.pow(2, args.length); i++) {
        values = (i).toString(2);
        while (values.length<args.length) values = "0"+values;

        let arguments = {};
        for (let j=0; j<args.length; j++) {
            arguments[args.slice(j, j+1)] = {1: true, 0: false}[values[j]]
        }
        table.push({parameters: values, value: Boolean(+evaluate(statement, arguments))});
    }
    return {variables: Array.from(args), table: table};
}