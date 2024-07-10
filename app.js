const express = require("express");

const axios = require("axios");

const app = express();
const port = 3000;

const apiUrl = "https://interview.adpeai.com/api/v2/get-task";

app.get("/list", async (req, res) => {
  console.log("hell");
  try {
    let currentYear = new Date();
    currentYear = currentYear.getFullYear() - 1;

    const result = await axios.get(apiUrl);
    const trans = result.data.transactions;
    const trans2021 = trans.filter((item) => {
      const date = new Date(item.timeStamp);
      return date.getFullYear() == currentYear;
    });

    const totalAmount = {};
    trans.forEach((trans) => {
      const empId = trans.employee.id;

      if (!totalAmount[empId]) {
        totalAmount[empId] = 0;
      }
      totalAmount[empId] += trans.amount;
    });

    // console.log(getAlphaObj);

    // console.log("alpha", getAlpha);

    console.log(totalAmount);
    let highestId = "";
    let hightEarn = 0;

    for (const [id, amount] of Object.entries(totalAmount)) {
      //   console.log("name ", item[0], "val", item[1]);
      if (amount > hightEarn) {
        hightEarn = amount;
        highestId = id;
      }
    }

    const topEarn = trans2021
      .filter((item) => {
        return item.employee.id == highestId && item.type === "alpha";
      })
      .map((item) => item.transactionID);
    const finalResult = {
      id: highestId,
      result: topEarn,
    };

    const submitData = await axios.post(apiUrl, finalResult);

    // console.log("log", topEarn.join("-"));

    res.send({
      message: "success",
      data: { id: highestId, earn: hightEarn },
      submitRes: { status: submitData.status },
    });
  } catch (error) {
    console.log(error);
  }

  //   return res.send({ msg: "success" });
});

app.listen(port, () => {
  console.log("nodejs is running 3000");
});
