import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function StatisticsCards({
  amount,
  text,
  icon,
}) {
  return (
    <Card>
      <CardContent
        sx={{
          backgroundColor: "primary.light",
        }}
      >
        <Box
          sx={{
            color: "black",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.5rem",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              component="div"
              sx={{
                textTransform: "uppercase",
                fontWeight: 400,
                marginBottom: "0.5rem",
              }}
            >
              {text}
            </Typography>
            <Typography
              variant="h5"
              fontWeight={500}
              component="div"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {amount}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "secondary.contrastText",
              aspectRatio: "1",
              borderRadius: "50%",
              height: 50,
              display: "grid",
              placeItems: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
