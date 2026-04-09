import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { RouteLoader, DocumentTitle } from "./common";

const About = lazy(() => import("@/modules/about/pages/About"));
const AboutResources = lazy(() => import("@/modules/about/pages/AboutResources"));
const AboutLearningPaths = lazy(() => import("@/modules/about/pages/AboutLearningPaths"));
const AboutProgress = lazy(() => import("@/modules/about/pages/AboutProgress"));
const Tool = lazy(() => import("@/modules/tool/pages/Tool"));
const Stack = lazy(() => import("@/modules/stack/pages/Stack"));
const CardUI = lazy(() => import("@/modules/card-ui/pages/CardUI"));

export const miscRoutes: RouteObject[] = [
  {
    path: "/about",
    element: (
      <RouteLoader>
        <About />
        <DocumentTitle
          seo={{
            title: "About Learnpathly",
            description:
              "Learn how Learnpathly helps you organize resources, build learning paths, and track your progress.",
          }}
        />
      </RouteLoader>
    ),
  },
  {
    path: "/about/resources",
    element: (
      <RouteLoader>
        <AboutResources />
        <DocumentTitle
          seo={{
            title: "About Resources - Learnpathly",
            description:
              "How Learnpathly helps you discover and organize learning resources.",
          }}
        />
      </RouteLoader>
    ),
  },
  {
    path: "/about/learning-paths",
    element: (
      <RouteLoader>
        <AboutLearningPaths />
        <DocumentTitle
          seo={{
            title: "About Learning Paths - Learnpathly",
            description: "How structured learning paths help you achieve your goals.",
          }}
        />
      </RouteLoader>
    ),
  },
  {
    path: "/about/progress",
    element: (
      <RouteLoader>
        <AboutProgress />
        <DocumentTitle
          seo={{
            title: "About Progress Tracking - Learnpathly",
            description: "Track your learning progress and stay motivated.",
          }}
        />
      </RouteLoader>
    ),
  },
  {
    path: "/tools",
    element: (
      <RouteLoader>
        <Tool />
        <DocumentTitle
          seo={{
            title: "Learning Tools - Learnpathly",
            description:
              "Tools to enhance your learning: flashcards, spaced repetition, and more.",
          }}
        />
      </RouteLoader>
    ),
  },
  {
    path: "/stack",
    element: (
      <RouteLoader>
        <Stack />
        <DocumentTitle
          seo={{
            title: "UI Components - Learnpathly",
            description: "UI component showcase.",
            noindex: true,
          }}
        />
      </RouteLoader>
    ),
  },
  {
    path: "/card-ui",
    element: (
      <RouteLoader>
        <CardUI />
        <DocumentTitle
          seo={{
            title: "Card UI - Learnpathly",
            description: "Card component showcase.",
            noindex: true,
          }}
        />
      </RouteLoader>
    ),
  },
];
