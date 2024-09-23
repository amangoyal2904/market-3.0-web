"use client";
import styled from "styled-components";

const StyledDisclaimer = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: #4d4d4d;
  line-height: 20px;
  margin: 50px 0;
  padding: 32px 80px;
  background-color: #f4f4f4;
`;

const ChartPatternDisclaimer = () => {
  return (
    <StyledDisclaimer>
      Disclaimer: The chart patterns identified by this tool, including
      triangles, wedges, and channels, are based on established technical
      analysis principles using real-time stock data. These insights are
      presented solely for educational and informational purposes. They do not
      constitute a recommendation to buy, sell, or hold any financial
      instrument. The media publishing house does not offer any predictions,
      targets, or specific investment advice. Users should independently verify
      all information and seek advice from certified financial experts before
      making any investment choices. We are not responsible for any trading
      losses or gains incurred from using this tool.
    </StyledDisclaimer>
  );
};

export default ChartPatternDisclaimer;
