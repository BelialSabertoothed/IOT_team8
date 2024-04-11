import {
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import classes from "./HeroHedder.module.css";

export function HeroHedder() {
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Your <span className={classes.highlight}>Personal</span>  <br />{" "}
            Meds Reminder
          </Title>
          <Text c="dimmed" mt="md" maw={400}>
            Never miss a dose again with Pills4U, the innovative IoT device engineered to keep you on track with your medication regimen.
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck
                  style={{ width: rem(12), height: rem(12) }}
                  stroke={1.5}
                />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Easy to use</b>
            </List.Item>
            <List.Item>
              <b>Track your loved one</b>
            </List.Item>
            <List.Item>
              <b>Notifications</b>
            </List.Item>
          </List>

          <Group mt={30}>
            <Button radius="xl" size="md" className={classes.control}>
              Get started
            </Button>
            {/* <Button
              variant="default"
              radius="xl"
              size="md"
              className={classes.control}
            >
              Buy one
            </Button> */}
          </Group>
        </div>
        <Image
          visibleFrom="md"
          src={"../../pictures/pills4u2.png"}
          h={400}
          w={500}
          fit="contain"
          fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        />
      </div>
    </Container>
  );
}

export default HeroHedder;
