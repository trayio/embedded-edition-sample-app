# Prompt for input from user:
read -p "Enter TRAY_ENDPOINT - prod or stg (prod): " ENDPOINT
ENDPOINT=${ENDPOINT:-prod}

read -p "Enter TRAY_PARTNER - name of partner, used for custom CSS + external route name (asana): " PARTNER
PARTNER=${x:-asana}

read -p "Enter TRAY_MASTER_TOKEN - the master token for your partner account (""): " MASTER_TOKEN
PARTNER=${x:-asana}

if [ -z "$MASTER_TOKEN"]; then
    echo ""
    echo "Error: Please run the script with your partner account master token"
    echo ""
else
    # Set env variables:
    export HTTPS=true
    export TRAY_ENDPOINT=$ENDPOINT
    export TRAY_PARTNER=$PARTNER
    export TRAY_MASTER_TOKEN=$MASTER_TOKEN

    # Run api and app:
    kill $(lsof -i:3001 -t) 2> /dev/null || sudo kill -9 $(lsof -i:3001 -t) 2> /dev/null
    kill $(lsof -i:3002 -t) 2> /dev/null || sudo kill -9 $(lsof -i:3002 -t) 2> /dev/null
    yarn run api & yarn run start
fi
