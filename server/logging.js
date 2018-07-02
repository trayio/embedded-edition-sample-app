
export const log = ({object, message}) => {
    if (!process.env.quiet) {
        console.log('------------------------------');
        if (message) {
            console.log(message);
        }
        if (object) {
            console.log(JSON.stringify(object, null, 4));
        }
        console.log('------------------------------');
    }
};
