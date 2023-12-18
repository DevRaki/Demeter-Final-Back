import { user } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import { Op } from 'sequelize';
import nodemailer from 'nodemailer';
import transporter from '../transporter.cjs';


export const getUsers = async (req, res) => {
    try {
        const users = await user.findAll({
            where: {
                TypeUser_ID: 1
            }
        });
        res.json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getUser = async (req, res) => {
    const { id } = req.params

    try {
        const getUser = await user.findOne({ where: { ID_User: id } });

        if (!getUser) return res.status(404).json({ message: 'El usuario no existe' })

        res.json(getUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const token = req.cookies.token;
        console.log('Token:', token); // Verifica si el token está llegando correctamente

        const user = jwt.decode(token, TOKEN_SECRET);
        console.log('Decoded User:', user); // Verifica si el token se decodifica correctamente

        const userId = user?.id || user?.ID_User;
        console.log('User ID:', userId); // Verifica el ID del usuario obtenido

        if (!userId) {
            return res.status(401).json({ error: "No se pudo obtener el ID del usuario" });
        }

        req.params = {
            ...req.params,
            id: userId
        };

        return getUser(req, res);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const checkForDuplicates = async (req, res, next) => {
    try {
        const { Document, Email } = req.body;

        const existingUser = await user.findOne({
            where: {
                [Op.or]: [{ Document }, { Email }],
            },
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'Ya existe un usuario con la misma cédula o correo electrónico.',
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    const { Type_Document, Document, Name_User, LastName_User, Password, Email, Role_ID } = req.body;

    try {
        const passwordHast = await bcrypt.hash(Password, 10)
        const newUser = await user.create({
            Type_Document,
            Document,
            Name_User,
            LastName_User,
            Email,
            Password: passwordHast,
            Restaurant: null,
            TypeUser_ID: 1,
            Role_ID,
            State: true
        });

        const token = await createAccessToken({ id: newUser.id });

        res.cookie('token', token);
        res.json({
            message: "Usuario creado correctamente",
            Nombre: newUser.Name_User,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params

    try {
        const { Type_Document, Document, LastName_User, Name_User, Email, Role_ID } = req.body

        const updateUser = await user.findByPk(id)

        updateUser.Type_Document = Type_Document
        updateUser.Document = Document
        updateUser.Name_User = Name_User
        updateUser.LastName_User = LastName_User
        updateUser.Role_ID = Role_ID
        updateUser.Email = Email

        await updateUser.save();

        return res.json(updateUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const editProfile = async (req, res) => {
    const { id } = req.params

    try {
        const { Name_User, LastName_User, Email } = req.body

        const updateUser = await user.findByPk(id)

        updateUser.Name_User = Name_User
        updateUser.LastName_User = LastName_User
        updateUser.Email = Email

        await updateUser.save();

        return res.json(updateUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const changePassword = async (req, res) => {
    const { id } = req.params

    try {

        const { Password, NewPassword } = req.body;

        const userFound = await user.findOne({ where: { ID_User: id } });

        const isMatch = await bcrypt.compare(Password, userFound.Password)

        if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

        const passwordHast = await bcrypt.hash(NewPassword, 10)

        const updateUser = await user.findByPk(id)

        updateUser.Password = passwordHast

        await updateUser.save();

        
        const token = await createAccessToken({ ID_User: userFound.ID_User });
        res.cookie('token', token);

        return res.json(updateUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const toggleUserStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const statusUser = await user.findOne({
            where: { ID_User: id },
        });

        if (!statusUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        };

        statusUser.State = !statusUser.State;

        await statusUser.save();

        return res.json(statusUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params

    try {
        await user.destroy({
            where: { ID_User: id },
        });

        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// -------------------c-------- Mesero ------------------------------------- //

export const getWaiters = async (req, res) => {
    try {
        const users = await user.findAll({
            where: {
                TypeUser_ID: 2
            }
        });
        res.json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getWaiter = async (req, res) => {
    const { id } = req.params

    try {
        const getUser = await user.findOne({ where: { ID_User: id } });

        if (!getUser) return res.status(404).json({ message: 'El usuario no existe' })

        res.json(getUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createWaiter = async (req, res) => {
    const { Type_Document, Document, Name_User, LastName_User, Restaurant } = req.body;

    try {
        const newUser = await user.create({
            Type_Document,
            Document,
            Name_User,
            LastName_User,
            Restaurant,
            TypeUser_ID: 2,
            Email: null,
            Password: null,
            Role_ID: null,
            State: true
        });

        res.json({
            message: "Mesero creado correctamente",
            Nombre: newUser.Name_User,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const duplicateWaiter = async (req, res, next) => {
    try {
        const { Document } = req.body;

        const existingWaiter = await user.findOne({
            where: {
                [Op.or]: [{ Document }],
            },
        });

        if (existingWaiter) {
            return res.status(400).json({
                error: 'Ya existe un usuario con la misma cédula',
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const login = async (req, res) => {
    const { Email, Password } = req.body
    try {

        const userFound = await user.findOne({ where: { Email } });
        if (!userFound) return res.status(400).json({ message: "Email invalido" });

        const isMatch = await bcrypt.compare(Password, userFound.Password)

        if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

        const token = await createAccessToken({ ID_User: userFound.ID_User });
        res.cookie('token', token);

        res.json({
            message: "Usuario ingresado correctamente",
            id: userFound.ID_User,
            name: userFound.Name_User,
            email: userFound.Email,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const logout = (req, res) => {
    res.cookie("token", "", {
        message: "Usted salió correctamente",
        expires: new Date(0),
    });
    return res.sendStatus(200);
}

export const profile = async (req, res) => {
    const UserFound = await user.findByPk(req.user.ID_User)

    if (!UserFound) return res.status(400).json({ message: 'Usuario no encontrado' });

    return res.json({
        id: UserFound.ID_User,
        username: UserFound.Name_User,
        email: UserFound.Email,
    })
}

export const verifyToken = async (req, res) => {
    const { token } = req.cookies

    if (!token) return res.status(401).json({ message: 'No autorizado' })

    jwt.verify(token, TOKEN_SECRET, async (err, decodedUser) => {
        if (err) return res.status(401).json({ message: 'No autorizado' });

        const userFound = await user.findByPk(decodedUser.ID_User)
        if (!userFound) return res.status(401).json({ message: 'No autorizado' })

        return res.json({
            id: userFound.ID_User,
            username: userFound.Name_User,
            email: userFound.Email,
        });
    });
};


export const forgotPassword = async (req, res) => {
    const { Email } = req.body;

    try {
        const foundUser = await user.findOne({ where: { Email } });

        if (!foundUser) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const resetToken = jwt.sign({ id: foundUser.ID_User }, TOKEN_SECRET, { expiresIn: '1h' });
        const resetUrl = ` http://localhost:5173/newPassword/${foundUser.ID_User}`;

        // Opciones del correo
        const mailOptions = {
            from: 'tucorreo@gmail.com', // Tu dirección de correo
            to: Email, // Email del usuario que necesita restablecer la contraseña
            subject: 'Restablecer Contraseña',
            text: `Para restablecer tu contraseña, haz clic en este enlace: ${resetUrl}`,
        };

        // Enviar el correo utilizando el transportador importado
        await transporter.sendMail(mailOptions);

        res.cookie("passwordToken", resetToken).json({ message: 'Se ha enviado un correo para restablecer la contraseña' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getUserCookies = (req, res) => {

    const cookies = req.cookies;

    res.json({
        cookies
    })
};

export const NewPassword = async (req, res) => {
    const { token, Password } = req.body;

    try {
        console.log('Token:', token);
        console.log('Password:', Password);

        const tokenDecode = jwt.decode(token, TOKEN_SECRET)
        console.log('Token Decode:', tokenDecode);

        const foundUser = await user.findOne({
            where: {
                ID_User: tokenDecode.id
            }
        });

        console.log('Found user:', foundUser);

        const passwordHast = await bcrypt.hash(Password, 10)
        await foundUser.update({ Password: passwordHast })

        console.log('Password updated successfully');

        res.cookie("passwordToken", "").json({
            msg: 'Se actualizó correctamente',
            hasError: false
        })


    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: error.message, hasError: true });
    }
};