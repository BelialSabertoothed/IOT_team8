import { Button, Slider } from "@mantine/core";

function App() {
  return (
    <div>
      <Slider
        marks={[
          { value: 20, label: "20%" },
          { value: 50, label: "50%" },
          { value: 80, label: "80%" },
        ]}
      />
      <Button variant="filled">Button</Button>
    </div>
  );
}

export default App;
