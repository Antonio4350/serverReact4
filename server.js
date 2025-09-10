import express from "express";
import cors from "cors";
import {
  getHero,
  updateHero,
  getAbout,
  updateAbout,
  getSkills,
  updateSkills,
  getProjects,
  insertProject,
  updateProject,
  deleteProject,
  loginUser
} from "./funcionesbd.js";

const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// ruta para el react
app.get("/api/portfolio", async (_req, res) => {
  const heroData = await getHero();
  const aboutData = await getAbout();
  const skillsData = await getSkills();
  const projectsData = await getProjects();

  res.json({
    portfolio: { hero: heroData, about: aboutData },
    skills: skillsData,
    projects: projectsData
  });
});

app.put("/api/portfolio", async (req, res) => {
  const { hero, about } = req.body;
  const updatedHero = hero !== undefined ? await updateHero(hero) : null;
  const updatedAbout = about !== undefined ? await updateAbout(about) : null;

  res.json({
    portfolio: {
      hero: updatedHero ? updatedHero.texto : undefined,
      about: updatedAbout ? updatedAbout.texto : undefined
    }
  });
});

// hero
app.get("/api/hero", async (_req, res) => {
  const hero = await getHero();
  res.json({ hero });
});

app.put("/api/hero", async (req, res) => {
  const { texto } = req.body;
  const updatedHero = await updateHero(texto);
  res.json({ hero: updatedHero.texto });
});

// sobre
app.get("/api/about", async (_req, res) => {
  const about = await getAbout();
  res.json({ about });
});

app.put("/api/about", async (req, res) => {
  const { texto } = req.body;
  const updatedAbout = await updateAbout(texto);
  res.json({ about: updatedAbout.texto });
});

// habilidades
app.get("/api/skills", async (_req, res) => {
  const skills = await getSkills();
  res.json({ skills });
});

app.put("/api/skills", async (req, res) => {
  const { skills } = req.body;
  const updatedSkills = await updateSkills(skills);
  res.json({ skills: updatedSkills });
});

// agregar habilidades
app.post("/api/skills", async (req, res) => {
  const { nombre, nivel } = req.body;
  const allSkills = await getSkills();
  const newSkill = { nombre, nivel };
  const updatedSkills = await updateSkills([...allSkills, newSkill]);
  res.json({ skills: updatedSkills });
});

// eliminar habilidades
app.delete("/api/skills/:id", async (req, res) => {
  const { id } = req.params;
  let skills = await getSkills();
  skills = skills.filter(s => s.id != id);
  const updatedSkills = await updateSkills(skills);
  res.json({ skills: updatedSkills });
});

// projectos
app.get("/api/projects", async (_req, res) => {
  const projects = await getProjects();
  res.json({ projects });
});

app.post("/api/projects", async (req, res) => {
  const { titulo, descripcion } = req.body;
  const newProject = await insertProject(titulo, descripcion);
  res.json({ project: newProject });
});

app.put("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion } = req.body;
  const updatedProject = await updateProject(id, titulo, descripcion);
  res.json({ project: updatedProject });
});

app.delete("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProject = await deleteProject(id);
  res.json({ project: deletedProject });
});

// login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const ok = await loginUser(username, password);
  if (ok) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Credenciales inválidas" });
  }
});

// servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
