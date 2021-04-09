import React from 'react';
import Chart from "react-google-charts";
import ServerDownAlert from "./functional/ServerDownAlert"

class Get extends React.Component 
{
    constructor(props) 
    {
        super(props)
        this.url = props.url
        this.state =
        {
            isLoading: true
        }

        this.getRequest()
    }

    getRequest()
    {
        let xml = new XMLHttpRequest();

        xml.onload = data => 
        {
            let risultato = JSON.parse(xml.responseText)
            let array = [];

            array.push(
                [
                  { type: 'date', label: 'time'},
                  { type: "number", label: "aTemp" },
                  { type: "number", label: "aHum" },
                  { type: "number", label: "bTemp" },
                  { type: "number", label: "bHum" },
                  { type: "number", label: "extTemp" },
                  { type: "number", label: "extHum" }
                ]
            );
            
            if (!Array.isArray(risultato))
            {
              risultato = [risultato]
            }
      
            for (let obj of risultato) {
              array.push(
                  [
                    new Date(obj["time"]),
                    obj["aTemp"],
                    obj["aHum"],
                    obj["bTemp"],
                    obj["bHum"],
                    obj["extTemp"],
                    obj["extHum"]
                  ]
              );
            }

            this.setState(
                {
                    isLoading: false,
                    data: array
                }
            )
        }

        xml.ontimeout = event =>
        {
            this.setState(
                {
                    isLoading: false,
                    serverDown: true
                }
            )
        }
  
        xml.open("GET", this.url, true)
        xml.timeout = 16000
        xml.setRequestHeader("X-AUTH-TOKEN", "BANANA-TOKEN-2021")
        xml.send(null)
    }

    render() 
    {
        if (this.state.isLoading)
        {
            return (
                <h4>Sto caricando i dati...</h4>
            );
        }
        else if (this.state.serverDown)
        {
            return (
                <ServerDownAlert />
            );
        }

        return (
            <div className="mt-3 mb-2">
                <Chart 
                    height = "450px"
                    chartType = "LineChart"
                    loader = "Loading chart..."
                    data = { this.state.data }
                />
            </div>
        );
    }
}

export default Get;
