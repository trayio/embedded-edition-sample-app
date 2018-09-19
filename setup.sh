# Prompt for input from user:
read -p "Enter TRAY_ENDPOINT - prod or stg (prod): " ENDPOINT
ENDPOINT=${ENDPOINT:-prod}

read -p "Enter TRAY_PARTNER - name of partner, used for custom CSS + external route name (asana): " PARTNER
PARTNER=${PARTNER:-asana}

read -p "Enter TRAY_MASTER_TOKEN - the master token for your partner account (""): " MASTER_TOKEN
if [ -e ".token" ]; then
    MASTER_TOKEN=${MASTER_TOKEN:-$(cat .token)}
fi

cleanup() {
    echo ""
    echo "Killing node processes - please enter your machine password if asked to run with sudo:";

    PORTA=$(lsof -t -i:3000)
    PORTB=$(lsof -t -i:3001)

    if [ -n $PORTA ]; then
        kill $PORTA || sudo kill -9 $PORTA &> /dev/null;
    fi

    if [ -n $PORTB ]; then
        kill $PORTB || sudo kill -9 $PORTB &> /dev/null;
    fi

    echo "Processes successfully killed"
}

exit() {
    cleanup;
    trap - SIGINT EXIT
    kill -- -$$
    kill -- -$(pgrep setup.sh)
}

if [ -z "$MASTER_TOKEN" ]; then
    echo ""
    echo "Error: Please run the script with your partner account master token"
    echo ""
else
    # Set env variables:
    export HTTPS=true
    export TRAY_ENDPOINT=$ENDPOINT
    export TRAY_PARTNER=$PARTNER
    export TRAY_MASTER_TOKEN=$MASTER_TOKEN

    > .token;
    echo "$MASTER_TOKEN" >> .token

    # Run api and app:
    cleanup;
    yarn run api & yarn run start
fi

trap exit SIGINT EXIT
