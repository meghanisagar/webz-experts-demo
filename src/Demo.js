import { useState, useEffect, useRef } from "react";
import { Card, Tab, Tabs, Button } from "react-bootstrap";

const Demo = () => {

  // Promotional data
  const [promotionalData, setPromotionalData] = useState([]);
  
  // Loading flag
  const [loadingData, setLoadingData] = useState(true);
  
  // Error details
  const [errorDetails, setErrorDetails] = useState("");
  
  // Variable for Drag-Sort Functionlity
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);


  // method having core logic of drag sort without 3rd party librery
  const handleSort = () => {

    // dublicate item to work with
    let _promotionalData = [...promotionalData];

    // remove drag item and save into dragged item content
    const draggedItemContent = _promotionalData.splice(dragItem.current, 1)[0];

    // switch positions
    _promotionalData.splice(dragOverItem.current, 0, draggedItemContent);

    // reset the position ref for new drag sort operation
    dragItem.current = null;
    dragOverItem.current = null;

    // update actual array to see data with updated order in state and local storage..
    localStorage.setItem("local-promotional-data", JSON.stringify(_promotionalData));
    setPromotionalData(_promotionalData);
  };

  const fetchPromotionalData = (api_url) => {
    fetch(api_url)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Error Occurred!");
        }
        return response.json();
      })
      .then(
        (data) => {
          localStorage.setItem("local-promotional-data", JSON.stringify(data));
          setErrorDetails("");
          setLoadingData(false);
          setPromotionalData(data);
        },
        (error) => {
          setErrorDetails(error.message);
          setLoadingData(false);
          setPromotionalData([]);
        }
      );
  };

  useEffect(() => {
    // API url
    const url = "https://run.mocky.io/v3/484016a8-3cdb-44ad-97db-3e5d20d84298";
    
    // check if data is in local storage or not
    // if not call an API and set API data in state as well as local storage
    // so once data stored in local storage out demo will use data from local storage and can save API call

    let localData = localStorage.getItem("local-promotional-data");
    let data = JSON.parse(localData);
    
    if (data !== null && data.length > 0) {
      
      // set error details and loading flag
      setErrorDetails("");
      setLoadingData(false);
      setPromotionalData(data);
    
    } else {

      // call function thaqt call API and store data in local storage as well as state 
      // it will set an error message if there is any error
      // and also mange Loading flag so use will know that data is loading...

      fetchPromotionalData(url);    
    }
  }, []);

  return (
    <>
      <Tabs
        defaultActiveKey="all_promo"
        id="promo-demo"
        className="mb-3"
        justify
        fill
      >
        <Tab eventKey="all_promo" title="All Promotions">
          {loadingData
            ? "Loading Data..."
            : errorDetails !== ""
            ? { errorDetails }
            : promotionalData.map((promotion, index) => {
                return (
                  <Card
                    key={index}
                    className={"draggable"}
                    draggable
                    onDragStart={() => (dragItem.current = index)}
                    onDragEnter={() => (dragOverItem.current = index)}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault}
                  >
                    <Card.Body>
                      <Card.Title>{promotion.name}</Card.Title>
                      <Card.Text>{promotion.description}</Card.Text>
                    </Card.Body>
                  </Card>
                );
              })}
        </Tab>
        <Tab eventKey="new_cust" title="New Customer">
          {loadingData
            ? "Loading Data..."
            : errorDetails !== ""
            ? { errorDetails }
            : promotionalData.map((promotion, index) => {
                return promotion.onlyNewCustomers ? (
                  <>
                    <Card id={index} style={{ width: "auto" }}>
                      <Card.Img variant="top" src={promotion.heroImageUrl} />
                      <Card.Body>
                        <Card.Title>{promotion.name}</Card.Title>
                        <Card.Text>{promotion.description}</Card.Text>
                        <Button variant="primary">
                          {promotion.joinNowButtonText}
                        </Button>
                      </Card.Body>
                    </Card>
                  </>
                ) : (
                  <></>
                );
              })}
        </Tab>
      </Tabs>
    </>
  );
};

export default Demo;
