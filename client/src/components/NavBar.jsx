import {
    AppBar,
    CssBaseline,
    IconButton,
    ImageList,
    ImageListItem,
    Link,
    Toolbar,
    Typography,
    useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../assets/Norcul_170.png";

const NavBar = ({ event, open }) => {
    const matches = useMediaQuery("(min-width:600px)");
    return (
        <>
            <CssBaseline />
            <AppBar
                position='fixed'
                sx={{
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0px 0px 25px 0px rgb(0, 102, 71)",
                    ...(open && {
                        width: `calc(100% - ${250}px)`,
                        marginLeft: `${250}px`,
                        transition: "all 0.3s ease",
                    }),
                }}
                mb={2}
            >
                <Toolbar>
                    <IconButton
                        aria-label='open drawer'
                        edge='end'
                        onClick={() => {
                            event();
                        }}
                        sx={{
                            color: "rgb(0, 102, 71)",
                            ...(open && { display: "none" }),
                            marginRight: "1rem",
                        }}
                    >
                        <MenuIcon sx={{ fontSize: "2rem" }} />
                    </IconButton>
                    <ImageList cols={1}>
                        <ImageListItem key='logo'>
                            <Link
                                href='/'
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <img src={Logo} alt='logo' />
                            </Link>
                        </ImageListItem>
                    </ImageList>
                    {matches && (
                        <Typography
                            variant='h6'
                            component='div'
                            sx={{
                                flexGrow: 4,
                                mt: 1,
                                mb: 1,
                                color: "rgb(0, 0, 0)",
                                textAlign: "right",
                                marginRight: "1rem",
                            }}
                        >
                            {`Hola, ${
                                sessionStorage.getItem("name").split(" ")[0]
                            } ${
                                sessionStorage.getItem("lastname").split(" ")[0]
                            }`}
                        </Typography>
                    )}
                </Toolbar>
            </AppBar>
        </>
    );
};

export default NavBar;
