import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";



const organization = {
  name: "Nerdy Network",
  tagline: "Think different",
  logo: "https://nerdynet.co/assets/logo-square.png",
  address: "Nerdy Network, 1234 Street Name, City, State, Zip",
  url: "https://nerdynet.co",
  email: "contact@nerdynet.co",
  phone: "+1 (123) 456-7890",
  socials:{
    twitter: "https://x.com/thenerdynet",
    linkedin: "https://linkedin.com/in/nerdy-network",
    instagram: "https://instagram.com/the_nerdy_network",
    github: "https://github.com/nerdynetco"
  }
}


export default function EmailWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#007291",
              },
            },
          },
        }}
      >
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="px-[32px] py-[40px]">
              <Row>
                <Column className="w-[80%]">
                  <Img
                    alt={organization.name}
                    height="42"
                    src={organization.logo}
                  />
                </Column>
                <Column align="right">
                  <Row align="right">
                    <Column>
                      <Link href={organization.socials.twitter}>
                        <Img
                          alt="X"
                          className="mx-[4px]"
                          height="36"
                          src="https://cdn-icons-png.flaticon.com/512/5968/5968958.png"
                          width="36"
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href={organization.socials.linkedin}>
                        <Img
                          alt="X"
                          className="mx-[4px]"
                          height="36"
                          src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png"
                          width="36"
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href={organization.socials.instagram}>
                        <Img
                          alt="Instagram"
                          className="mx-[4px]"
                          height="36"
                          src="https://cdn-icons-png.flaticon.com/512/15713/15713420.png"
                          width="36"
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href={organization.socials.github}>
                        <Img
                          alt="Github"
                          className="mx-[4px]"
                          height="36"
                          src="https://cdn-icons-png.flaticon.com/512/1051/1051377.png"
                          width="36"
                        />
                      </Link>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section>
            <Container className="px-[32px] py-[40px]">{children}</Container>

            <Section className="text-center">
              <table className="w-full">
                <tr className="w-full">
                  <td align="center">
                    <Img
                      alt={organization.name}
                      height="42"
                      src={organization.logo}
                    />
                  </td>
                </tr>
                <tr className="w-full">
                  <td align="center">
                    <Text className="my-[8px] text-[16px] font-semibold leading-[24px] text-gray-900">
                      {organization.name}
                    </Text>
                    <Text className="mb-0 mt-[4px] text-[16px] leading-[24px] text-gray-500">
                      {organization.tagline}
                    </Text>
                  </td>
                </tr>
              </table>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
