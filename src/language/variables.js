const variables = [{}];

export default variables;

export const newScope = () => {
    variables.push({});
}

export const endScope = () => {
    variables.pop();
}

export const assign = (name, value) => {
    //verify if variable exist in upper scope
    for (let i = variables.length - 1; i >= 0; i--) {
        if (variables[i][name] !== undefined) {
            variables[i][name] = value;
            return;
        }
    }
    //if not, create it in the current scope
    variables[variables.length - 1][name] = value;
}

export const get = (name) => {
    for (let i = variables.length - 1; i >= 0; i--) {
        if (variables[i][name] !== undefined) {
            return variables[i][name];
        }
    }
    throw new Error(`Variable ${name} is not defined`);
}