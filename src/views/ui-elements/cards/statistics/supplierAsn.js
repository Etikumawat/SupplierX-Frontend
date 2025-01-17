// ** React Imports
import { useEffect, useState } from "react";
import themeConfig from "../../../../configs/themeConfig";
import { CircularProgress } from "@mui/material";
import "../../../Analytics/AnalyticsDash.css";
import { ThemeColors } from "@src/utility/context/ThemeColors";
import axios from "axios";
import Chart from "react-apexcharts";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AlertCircle } from "react-feather";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import {
  Close,
  LocalShipping,
  ReceiptLongOutlined,
  ReceiptOutlined,
} from "@mui/icons-material";

const supplierAsn = (props) => {
  let userdata = localStorage.getItem("userData");
  const info = JSON.parse(userdata);
  const id = info?.supplierId;

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState();

  useEffect(() => {
    setLoading(true);
    axios
      .post(
        new URL(
          `/api/v1/admin/dashboard/detailedAsnSupplierWise/${id}`,
          themeConfig.backendUrl
        )
      )

      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        }
        console.log(res.data, "asn data");

        setValue(res.data);
        setLoading(false);
      });
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 15000);

    return () => clearTimeout(timeout);
  }, []);

  const data = {
    title: "Advance Shipping Note",
    last_days: ["Last 28 Days", "Last Month", "Last Year"],
    totalAsn: value?.asnTotal,
    shipped: value?.asnMaterialShipped,
    gateInward: value?.asnMaterialGateInward,
    invoiced: value?.asnInvoiced,
    received: value?.asnMaterialReceived,
  };
  const options = {
      plotOptions: {
        radialBar: {
          size: 150,
          offsetY: 20,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: "65%",
          },
          track: {
            background: "#fff",
            strokeWidth: "100%",
          },
          dataLabels: {
            name: {
              offsetY: -5,
              fontFamily: "Public Sans",
              fontSize: "1rem",
            },
            value: {
              offsetY: 15,
              fontFamily: "Public Sans",
              fontSize: "1.714rem",
            },
          },
        },
      },
      colors: [props.danger],

      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: [props.primary],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        dashArray: 8,
      },
      labels: ["Total ASN"],
    },
    series = [value?.asnTotal];
  // series = [100];

  return data !== null ? (
    <Card>
      <div style={{ backgroundColor: "rgb(242 108 19 / 6%)" }}>
        <CardHeader className="pb-0" style={{ justifyContent: "center" }}>
          <CardTitle style={{ color: "#f26c13" }} tag="h4">
            {data.title}
          </CardTitle>
          <UncontrolledDropdown className="chart-dropdown">
            <DropdownToggle
              color=""
              className="bg-transparent btn-sm border-0 p-50"
            ></DropdownToggle>
            <DropdownMenu end>
              {data.last_days.map((item) => (
                <DropdownItem className="w-100" key={item}>
                  {item}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
        </CardHeader>
        {value ? (
          <CardBody>
            <div className="d-flex justify-content-between">
              <Col sm="2" className="text-center">
                <h1 className="font-large-2 fw-bolder mt-2 mb-0">
                  {data?.shipped}
                </h1>
                <CardText>
                  {/* <ReceiptLongOutlined /> */}
                  Shipped
                </CardText>
              </Col>
              <Col sm="2" className="text-center">
                <h1 className="font-large-2 fw-bolder mt-2 mb-0 ">
                  {data.invoiced}
                </h1>
                <CardText>
                  {/* <Close /> */}
                  Invoiced
                </CardText>
              </Col>
            </div>
            <div>
              <Chart
                options={options}
                series={series}
                type="radialBar"
                height={270}
                id="support-tracker-card"
              />
            </div>
            <div className="d-flex justify-content-between mt-1">
              <div className="text-center">
                <span className="font-large-1 fw-bolder">
                  {data.gateInward}
                </span>
                <CardText className="mb-50 fw-bold">
                  {/* <LocalShipping /> */}
                  Gate Inward
                </CardText>
              </div>

              <div className="text-center">
                <span className="font-large-1 fw-bolder">{data.received}</span>
                <CardText className="mb-50 fw-bold">
                  {/* <ReceiptOutlined /> */}
                  Received
                </CardText>
              </div>
            </div>
          </CardBody>
        ) : loading ? (
          <div
            style={{
              backgroundColor: "rgb(242 108 19 / 0%) !important",
            }}
            className="mb-50 status-tracker"
          >
            <CircularProgress style={{ color: "#e06522" }} />
          </div>
        ) : (
          <div
            style={{ backgroundColor: "rgb(242 108 19 / 0%)" }}
            className="mb-50 status-tracker"
          >
            <AlertCircle
              size={50}
              style={{
                color: "#e06522",
                backgroundColor: "rgb(242 108 19 / 6%)",
              }}
            />
          </div>
        )}
      </div>
    </Card>
  ) : null;
};

export default supplierAsn;
