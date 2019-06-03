# Prompt for input from user:
read -p "Enter TRAY_ENDPOINT - prod or stg (prod): " ENDPOINT
ENDPOINT=${ENDPOINT:-prod}

read -p "Enter TRAY_PARTNER - name of partner, used for custom CSS + external route name (asana): " PARTNER
PARTNER=${PARTNER:-asana}


cleanup() {
    echo ""
    echo "Killing processes on port 3000 and 3001";

    PORT_A=$(lsof -t -i:3000)
    PORT_B=$(lsof -t -i:3001)

    if [ -n $PORT_A ]; then
        kill -9 $PORT_A &> /dev/null;
    fi

    if [ -n $PORT_B ]; then
        kill -9 $PORT_B &> /dev/null;
    fi

    echo "Processes successfully killed"
}

exit() {
    cleanup;
    trap - SIGINT EXIT
    kill -- -$$
    kill -- -$(pgrep setup.sh)
}

    # Set env variables:
    export HTTPS=true
    export TRAY_ENDPOINT=$ENDPOINT

    # Run api and app:
    cleanup;
    npm run api & npm run start

trap exit SIGINT EXIT
